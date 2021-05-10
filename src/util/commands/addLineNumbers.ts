/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { LineNumberer } from '../lineNumberer';
import { LineNumbersInput } from '../quickpicks/lineNumbers';
import { GCommand, UtilCommands } from './common';

export class AddLineNumbers extends GCommand {
    constructor() {
        super(UtilCommands.AddLineNumbers);
    }

    async execute() {
        const lnInputs = new LineNumbersInput();
        const state = await lnInputs.collect();

        const ln = new LineNumberer();
        await ln.addNumbers(state.start, state.increment, true);
    }
}
