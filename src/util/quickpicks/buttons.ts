/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { QuickInputButton, ThemeIcon, Uri } from 'vscode';

export class GButton implements QuickInputButton {
    constructor(public iconPath: Uri | { dark: Uri; light: Uri } | ThemeIcon, public tooltip: string | undefined) {}
}
