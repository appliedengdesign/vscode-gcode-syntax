/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { GCommands } from '../constants';
import { LineNumberer } from '../lineNumberer';
import { GCommand } from './base';

export class RemoveLineNumbers extends GCommand {
    constructor() {
        super(GCommands.RemoveLineNumbers);
    }

    async execute() {
        const ln = new LineNumberer();
        await ln.removeNumbers();
    }
}
