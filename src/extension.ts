/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';
import * as vscode from 'vscode';
import { Config, configuration } from './util/configuration/config';
import { constants } from './util/constants';
import { Logger } from './util/logger';
import { registerCommands } from './util/commands';
import { Control } from './control';
import { GCodeViewer } from './commands/gcodeViewer';

export function activate(context: vscode.ExtensionContext) {
    const start = process.hrtime();

    // Initialize Logger
    Logger.initialize(context);
    Logger.enable();

    // Initialize Config
    const cfg = configuration;
    Config.initialize(context, cfg);

    // Register Commands
    void registerCommands(context);

    // Initialize Controller
    Control.initialize(context, configuration);

    const gcodeViewerDisposable = vscode.commands.registerCommand(`gcode.${GCodeViewer.commandName}`, () => {
        const gcodeViewerPanel = vscode.window.createWebviewPanel(
            'gcode_GCodeViewer',
            'G-Code Preview',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
            },
        );
        const command = new GCodeViewer(context);
        command.execute(gcodeViewerPanel.webview);
    });
    context.subscriptions.push(gcodeViewerDisposable);

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
