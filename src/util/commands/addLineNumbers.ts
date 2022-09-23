/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { configuration } from '../configuration/config';
import { GCommands } from '../constants';
import { LineNumberer } from '../lineNumberer';
import { LineNumbersInput } from '../quickpicks/lineNumbers';
import { GCommand } from './base';

export class AddLineNumbers extends GCommand {
    constructor() {
        super(GCommands.AddLineNumbers);
    }

    async execute() {
        const ln = new LineNumberer();

        if (configuration.getParam('lineNumberer.enableQuickPick')) {
            const lnInputs = new LineNumbersInput();
            const state = await lnInputs.collect();

            await ln.addNumbers(state.start, state.increment);
        } else {
            await ln.addNumbers();
        }
    }
}
