/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { Disposable } from 'vscode';
import { AddComment } from './addComment';
import { AddLineNumbers } from './addLineNumbers';
import { RemoveComment } from './removeComment';
import { RemoveLineNumbers } from './removeLineNumbers';
import { ShowGCodeSettings } from './showGCodeSettings';
import { ShowSupportGCode } from './showSupportGCode';

export { AddComment } from './addComment';
export { AddLineNumbers } from './addLineNumbers';
export { RemoveComment } from './removeComment';
export { RemoveLineNumbers } from './removeLineNumbers';
export { ShowGCodeSettings } from './showGCodeSettings';
export { ShowSupportGCode } from './showSupportGCode';

export function registerCommands(): Disposable[] {
    return [
        new AddComment(),
        new AddLineNumbers(),
        new RemoveComment(),
        new RemoveLineNumbers(),
        new ShowGCodeSettings(),
        new ShowSupportGCode(),
    ];
}
