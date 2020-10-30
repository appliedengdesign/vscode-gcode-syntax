/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
 import * as path from 'path';
import { extensions } from 'vscode';

 const publisher = 'appliedengdesign';
 const extensionId = 'vscode-gcode-syntax';
 const extensionQualifiedID = publisher + '.' + extensionId;
 
 const gcode = extensions.getExtension(extensionQualifiedID);

 export const constants = {
    configId: gcode?.packageJSON.contributes.languages[0].id,
    copyright: gcode?.packageJSON.copyright,
    extension: {
        name: gcode?.packageJSON.displayName,
        version: gcode?.packageJSON.version,
        shortname: gcode?.packageJSON.shortName,
    },
    extensionOutputChannelName: gcode?.packageJSON.shortName,
    iconsPath: path.join(__dirname, "..", "..", "resources", "icons"),
    iconExt: '.svg',
    langId: gcode?.packageJSON.contributes.languages[0].id,
    urls: {
        changeLog: 'https://github.com/appliedengdesign/vscode-gcode-syntax/blob/master/CHANGELOG.md',
        readme: 'https://github.com/appliedengdesign/vscode-gcode-syntax/blob/master/README.md',
    },
 };