/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { LineNumberer } from '../lineNumberer';
import { GCommand, UtilCommands } from './common';

export class RemoveLineNumbers extends GCommand {
    constructor() {
        super(UtilCommands.RemoveLineNumbers);
    }

    async execute() {
        const ln = new LineNumberer();
        await ln.removeNumbers(true);
    }
}
