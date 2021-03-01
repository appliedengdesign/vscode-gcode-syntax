/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { stripComments } from './helpers';

interface Coords {
    x: number;
    y: number;
    z: number;
}

interface State {
    distance: number;
    feedrate: number;
    rapid: boolean;
    circ: boolean;
    abs: boolean;
    rt: number;
}

export class GCodeRuntimeParser {
    private _code: string;
    private _runtime: number;

    constructor(readonly text: string) {
        this._code = text;
        this._runtime = 0;
    }

    getRuntime(): number {
        return this._runtime;
    }

    update(): boolean {
        return this.genRunTime();
    }

    private genRunTime(): boolean {
        const oldpt: Coords = { x: 0, y: 0, z: 0 };
        const newpt: Coords = { x: 0, y: 0, z: 0 };
        const ijk: Coords = { x: 0, y: 0, z: 0 };
        const state: State = {
            distance: 0,
            feedrate: 1,
            rapid: true,
            circ: false,
            abs: true,
            rt: 0,
        };

        // Split into lines
        const lines = this._code.match(/.*(?:\r\n|\r|\n)/g) || [];

        for (let i = 0; i < lines.length; ++i) {
            let line = lines[i].trim();

            if (line.length === 0) {
                continue;
            }

            line = stripComments(line);

            // eslint-disable-next-line
            const re = /((?:\$\$)|(?:\$[a-zA-Z0-9#]*))|([a-zA-Z][0-9\+\-\.]+)|(\*[0-9]+)|([#][0-9]+)|([#][\[].+[\]])/igm;

            const words = line.match(re) || [];

            words.forEach(word => {
                const letter = word[0].toUpperCase();
                const argument = word.slice(1);

                if (letter === 'G') {
                    switch (argument) {
                        case '90':
                            state.abs = true;
                            break;

                        case '91':
                            state.abs = false;
                            break;

                        case '00':
                        case '0':
                            state.rapid = true;
                            state.circ = false;
                            break;

                        case '01':
                        case '1':
                            state.rapid = false;
                            state.circ = false;
                            break;

                        case '02':
                        case '2':
                        case '03':
                        case '3':
                            state.rapid = false;
                            state.circ = true;
                            break;
                    }
                }

                // Feed Rate
                if (letter === 'E' || letter === 'F') {
                    state.feedrate = +argument / 60.0; // Convert Per Min to Per Second
                }

                // Coords
                if (letter === 'X') {
                    newpt.x = +argument;
                }

                if (letter === 'Y') {
                    newpt.y = +argument;
                }

                if (letter === 'Z') {
                    newpt.z = +argument;
                }

                // Circular Interpolation
                if (letter === 'I') {
                    ijk.x = +argument;
                }

                if (letter === 'J') {
                    ijk.y = +argument;
                }

                if (letter === 'K') {
                    ijk.z = +argument;
                }
            });

            // End of Line

            // Calculate Distance Moved
            if (state.abs) {
                state.distance = Math.sqrt(
                    Math.pow(newpt.x - oldpt.x, 2) + Math.pow(newpt.y - oldpt.y, 2) + Math.pow(newpt.z - oldpt.z, 2),
                );

                Object.assign(oldpt, newpt);
            }

            if (!state.rapid) {
                // Calculate Time :: t = d / v
                state.rt += state.distance / state.feedrate;
            }
        }

        this._runtime = state.rt;

        return true;
    }
}
