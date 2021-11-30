/* eslint-disable max-classes-per-file */
/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { ExtensionContext } from 'vscode';
import * as Commands from './commands/cmds';

export function registerCommands(context: ExtensionContext): void {
    context.subscriptions.push(
        new Commands.ShowGCodeSettings(),
        new Commands.ShowSupportGCode(),
        new Commands.AddComment(),
        new Commands.RemoveComment(),
        new Commands.AddLineNumbers(),
        new Commands.RemoveLineNumbers(),
    );
}
