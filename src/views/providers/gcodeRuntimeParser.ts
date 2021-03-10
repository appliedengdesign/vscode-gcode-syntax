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
        const ijkr = { i: 0, j: 0, k: 0, r: -1 };
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
                    if (!isNaN(+argument)) {
                        state.feedrate = +argument;
                    }
                }

                // Coords
                if (letter === 'X') {
                    if (!state.abs) {
                        newpt.x = +argument + oldpt.x;
                    } else {
                        newpt.x = +argument;
                    }
                }

                if (letter === 'Y') {
                    if (!state.abs) {
                        newpt.y = +argument + oldpt.y;
                    } else {
                        newpt.y = +argument;
                    }
                }

                if (letter === 'Z') {
                    if (!state.abs) {
                        newpt.z = +argument + oldpt.z;
                    } else {
                        newpt.z = +argument;
                    }
                }

                // Circular Interpolation
                if (letter === 'I') {
                    ijkr.i = +argument;
                }
                if (letter === 'J') {
                    ijkr.j = +argument;
                }

                if (letter === 'K') {
                    ijkr.k = +argument;
                }

                if (letter === 'R') {
                    ijkr.r = +argument;
                }
            });

            // End of Line

            // Calculate Distance Moved

            state.distance = Math.sqrt(
                Math.pow(newpt.x - oldpt.x, 2) + Math.pow(newpt.y - oldpt.y, 2) + Math.pow(newpt.z - oldpt.z, 2),
            );

            if (state.circ) {
                // Circular Interpolation
                const centerpt = [oldpt.x - ijkr.i, oldpt.y - ijkr.j, oldpt.z - ijkr.k];
                let radius: number;
                if (ijkr.r === -1) {
                    // IJK Mode
                    radius = Math.sqrt(Math.pow(centerpt[0], 2) + Math.pow(centerpt[1], 2) + Math.pow(centerpt[2], 2));
                } else {
                    // Radius Mode
                    radius = ijkr.r;
                }

                // Arc Length: ( 2( arcsin(d / 2r) ) / 2)
                const arclen = 2 * Math.asin(state.distance / (2 * radius)) * radius;

                state.distance = arclen;

                // New Point -> Old Point
                Object.assign(oldpt, newpt);

                // Reset IJK
                ijkr.i = ijkr.j = ijkr.k = 0;
                ijkr.r = -1;
            }

            // New Point -> Old Point
            Object.assign(oldpt, newpt);

            if (!state.rapid && !isNaN(state.distance)) {
                // Calculate Time :: t = d / v :: Convert Feedrate from IPM to Per Second
                state.rt += state.distance / (state.feedrate / 60);
            }
        }
        if (!isNaN(state.rt)) {
            this._runtime = state.rt;
            return true;
        } else {
            this._runtime = 0;
            return false;
        }
    }
}
