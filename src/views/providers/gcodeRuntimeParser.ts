/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { 
    stripComments 
} from "./helpers";

interface Coords {
    x: number,
    y: number,
    z: number
}

export class GCodeRuntimeParser {

    private _code: string;
    private _runtime: number;

    constructor( readonly text: string) {

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

        const oldpt: Coords = { x:0, y:0, z:0 };
        const newpt: Coords = { x:0, y:0, z:0 };
        let distance = 0;
        let feedrate = 1;
        let rapid = true;
        let abs = true;
        let rt = 0;

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

            words.forEach(function(word) {

                const letter = word[0].toUpperCase();
                const argument = word.slice(1);

                if (letter === 'G') {
                    switch(argument) {

                        case '90':
                            abs = true;
                            break;

                        case '91':
                            abs = false;
                            break;

                        case '00':
                        case '0':
                            rapid = true;
                            break;

                        case '01':
                        case '1':
                            rapid = false;
                            break;
                    }
                }

                // Feed Rate
                if ((letter === 'E') || (letter === 'F')) {
                    feedrate = ( +argument / 60.0);         // Convert Per Min to Per Second
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

            });

            // End of Line

            // Calculate Distance Moved
            if (abs) {
                distance = Math.sqrt( Math.pow((newpt.x - oldpt.x), 2) + Math.pow((newpt.y - oldpt.y), 2) + Math.pow((newpt.z - oldpt.z), 2) );

                Object.assign(oldpt, newpt);
            }

            if (!rapid) {
                // Calculate Time :: t = d / v
                rt += (distance / feedrate);
            }
            

        }


        this._runtime = rt;

        return true;
    }

}