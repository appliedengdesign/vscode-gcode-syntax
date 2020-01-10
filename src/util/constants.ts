/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

 import * as path from 'path';
 import * as manifest from '../manifest.json';

 export const name = manifest.name;
 export const version = manifest.version;

 export const iconsPath = path.join(__dirname, "..", "..", "resources", "icons");