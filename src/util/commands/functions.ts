/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { Disposable } from 'vscode';
import { GCommands } from '../constants';
import { GCommand } from './base';
import * as Cmds from './cmds';

export function registerCommands(): Disposable[] {
    const gcmds: GCommand[] = [];

    Object.values(Cmds).forEach(c => {
        if (Object.keys(GCommands).includes(c.name)) {
            gcmds.push(new c());
        }
    });

    return gcmds;
}
