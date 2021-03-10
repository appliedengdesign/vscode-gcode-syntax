/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { commands } from 'vscode';
import { GCommand, UtilCommands } from './common';
import { constants, VSBuiltInCommands } from '../constants';

export class ShowGCodeSettings extends GCommand {
    constructor() {
        super(UtilCommands.ShowGCodeSettings);
    }

    execute() {
        void commands.executeCommand(VSBuiltInCommands.OpenSettings, `@ext:${constants.extensionQualifiedId}`);
    }
}
