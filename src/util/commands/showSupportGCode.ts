/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { GCommand, UtilCommands } from './common';
import { Messages } from '../messages';

export class ShowSupportGCode extends GCommand {
    constructor() {
        super(UtilCommands.ShowSupportGCode);
    }

    execute() {
        return Messages.showSupportGCodeMessage();
    }
}
