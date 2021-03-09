/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import * as path from 'path';
import { extensions } from 'vscode';

const publisher = 'appliedengdesign';
const extensionId = 'vscode-gcode-syntax';
const extensionQualifiedId = `${publisher}.${extensionId}`;

const gcode = extensions.getExtension(extensionQualifiedId)!;

interface IConstants {
    readonly configId: string;
    readonly copyright: string;
    readonly extension: {
        readonly name: string;
        readonly version: string;
        readonly shortname: string;
    };
    readonly extensionOutputChannelName: string;
    readonly extensionQualifiedId: string;
    readonly iconsPath: string;
    readonly iconExt: string;
    readonly langId: string;
    readonly urls: {
        readonly changeLog: string;
        readonly readme: string;
        readonly vsmpReviews: string;
    };
}

export const constants: IConstants = {
    configId: gcode.packageJSON.contributes.languages[0].id,
    copyright: gcode.packageJSON.copyright,
    extension: {
        name: gcode.packageJSON.displayName,
        version: gcode.packageJSON.version,
        shortname: gcode.packageJSON.shortName,
    },
    extensionOutputChannelName: gcode.packageJSON.shortName,
    extensionQualifiedId: extensionQualifiedId,
    iconsPath: path.join(__dirname, '..', '..', 'resources', 'icons'),
    iconExt: '.svg',
    langId: gcode.packageJSON.contributes.languages[0].id,
    urls: {
        changeLog: 'https://github.com/appliedengdesign/vscode-gcode-syntax/blob/master/CHANGELOG.md',
        readme: 'https://github.com/appliedengdesign/vscode-gcode-syntax/blob/master/README.md',
        vsmpReviews:
            'https://marketplace.visualstudio.com/items?' +
            'itemName=appliedengdesign.vscode-gcode-syntax&ssr=false#review-details',
    },
};

export const enum PIcon {
    Alert = ' $(alert) ',
    Check = ' $(check) ',
    Heart = ' $(heart) ',
}

export const enum VSBuiltInCommands {
    OpenSettings = 'workbench.action.openSettings',
    SetContext = 'setContext',
}

export const enum Contexts {
    NavTreeViewEnabled = 'gcode:navTree:enabled',
}
