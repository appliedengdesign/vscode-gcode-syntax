/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { GCommand } from './base';
import { Messages } from '../messages';
import { GCommands } from '../constants';

export class ShowSupportGCode extends GCommand {
    constructor() {
        super(GCommands.ShowSupportGCode);
    }

    execute() {
        return Messages.showSupportGCodeMessage();
    }
}
