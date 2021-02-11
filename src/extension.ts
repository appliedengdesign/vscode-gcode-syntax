/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';
import { ExtensionContext } from 'vscode';
import { Config, configuration } from './util/config';
import { constants } from './util/constants';
import { Logger } from './util/logger';
import { GCommand } from './util/commands';
import { Control } from './control';



export async function activate(context: ExtensionContext) {

    const start = process.hrtime();

    // Initialize Logger
    Logger.initialize(context);
    Logger.enable();

    // Initialize Config
    Config.initialize(context);

    Logger.log(constants.extension.shortname + " v" + constants.extension.version + " activated.");
    Logger.log(constants.copyright);

    // Register Commands
    GCommand.registerCommands(context);
    
    // Initialize Controller
    Control.initialize(context, configuration);
    
    
}

export function deactivate() {
    
    // Clean up
    Control.terminate();
    
}