/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { LineNumberer } from '../lineNumberer';
import { GCommand, UtilCommands } from './common';

export class AddLineNumbers extends GCommand {
    constructor() {
        super(UtilCommands.AddLineNumbers);
    }

    async execute() {
        const ln = new LineNumberer();
        await ln.addNumbers(10, 10, true);
    }
}
