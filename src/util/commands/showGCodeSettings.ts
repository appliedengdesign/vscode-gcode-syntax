/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { commands } from 'vscode';
import { GCommand } from './base';
import { constants, GCommands, VSBuiltInCommands } from '../constants';

export class ShowGCodeSettings extends GCommand {
    constructor() {
        super(GCommands.ShowGCodeSettings);
    }

    execute() {
        void commands.executeCommand(VSBuiltInCommands.OpenSettings, `@ext:${constants.extensionQualifiedId}`);
    }
}
