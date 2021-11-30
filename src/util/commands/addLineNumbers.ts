/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { configuration } from '../configuration/config';
import { LineNumberer, LineNumbererOptions } from '../lineNumberer';
import { LineNumbersInput } from '../quickpicks/lineNumbers';
import { GCommand, UtilCommands } from './common';

export class AddLineNumbers extends GCommand {
    constructor() {
        super(UtilCommands.AddLineNumbers);
    }

    async execute() {
        const lnInputs = new LineNumbersInput();
        const state = await lnInputs.collect();

        const opts: LineNumbererOptions = {};

        opts.addSpaceAfter = configuration.getParam('lineNumberer.addSpaceAfter');
        opts.frequency = configuration.getParam('lineNumberer.frequency');
        opts.ignoreBlank = configuration.getParam('lineNumberer.ignoreBlank');
        opts.ignoreComments = configuration.getParam('lineNumberer.ignoreComments');
        opts.ignoreProgramNumbers = configuration.getParam('lineNumberer.ignoreProgramNumbers');

        const ln = new LineNumberer();
        await ln.addNumbers(state.start, state.increment, true, opts);
    }
}
