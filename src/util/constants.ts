/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
 import * as path from 'path';

 export const extensionId = 'vscode-gcode-syntax';
 export const extensionOutputChannelName = 'G-Code';
 export const extensionQualifiedId = `appliedengdesign.${extensionId}`;

 export const iconsPath = path.join(__dirname, "..", "..", "resources", "icons");