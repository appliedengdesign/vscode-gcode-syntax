/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';
import { ExtensionContext } from 'vscode';
import { configuration } from './util/configuration/config';
import { constants } from './util/constants';
import { Logger } from './util/logger';
import { Control } from './control';

export function activate(context: ExtensionContext) {
    const start = process.hrtime();

    // Initialize Logger
    Logger.initialize(context);
    Logger.enable();

    // Initialize Controller
    Control.initialize(context, configuration);

    Logger.log(
        `${constants.extension.shortname} v${constants.extension.version} activated in ${Control.getLoadTime(
            start,
        ).toFixed(3)}ms`,
    );
    Logger.log(constants.copyright);
}

export function deactivate() {
    // Clean up
    Control.terminate();

    // Close Logger
    Logger.close();
}
