/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';
import { ConfigurationChangeEvent, ExtensionContext, OutputChannel, window } from 'vscode';
import { configuration } from './configuration/config';
import { defaults, TraceLevel } from './configuration/defaults';
import { constants } from './constants';

/* Log Levels
    Silent - No Output
    Errors - Errors only
    Warnings - Warnings + Errors
    Verbose - Standard Outputs + Warnings + Errors
    Debug - Everything
*/

const configTraceLevel = 'general.outputLevel';

export class Logger {
    private static output: OutputChannel | undefined;
    private static _level: TraceLevel = TraceLevel.Verbose;

    static initialize(context: ExtensionContext, level?: TraceLevel) {
        this.level = level ?? this._level;
        this.output = this.output || window.createOutputChannel(constants.extensionOutputChannelName);

        context.subscriptions.push(configuration.onDidChange(this.onConfigurationChanged, this));
    }

    private static onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, configTraceLevel)) {
            this.level = configuration.getParam(configTraceLevel) ?? defaults.general.outputLevel;
        }
    }

    static get level() {
        return this._level;
    }

    static set level(value: TraceLevel) {
        this._level = value;

        if (value === TraceLevel.Silent) {
            if (this.output != null) {
                this.close();
            }
        } else {
            this.output = this.output ?? window.createOutputChannel(constants.extensionOutputChannelName);
        }
    }

    static enable() {
        if (this.output === undefined) {
            return;
        }

        this.output.show();
    }

    static debug(message: string): void {
        if (
            this.level === TraceLevel.Silent ||
            this.level === TraceLevel.Errors ||
            this.level === TraceLevel.Warnings ||
            this.level === TraceLevel.Verbose
        ) {
            return;
        }

        if (this.output !== undefined) {
            this.output.appendLine(message);
        }
    }

    static log(message: string): void {
        if (
            this.level === TraceLevel.Silent ||
            this.level === TraceLevel.Errors ||
            this.level === TraceLevel.Warnings
        ) {
            return;
        }

        if (this.output !== undefined) {
            this.output.appendLine(`${this.level === TraceLevel.Debug ? this.timestamp : ''} ${message}`);
        }
    }

    static warn(message: string): void {
        if (this.level === TraceLevel.Silent || this.level === TraceLevel.Errors) {
            return;
        }

        if (this.output !== undefined) {
            this.output.appendLine(message);
        }
    }

    static error(err: Error | unknown, message?: string): void {
        if (this.level === TraceLevel.Silent) {
            return;
        }

        if (message == null) {
            const stack = err instanceof Error ? err.stack : undefined;

            if (stack) {
                const match = /.*\s*?at\s(.+?)\s/.exec(stack);
                if (match != null) {
                    message = match[1];
                }
            }
        }

        if (this.output !== undefined) {
            this.output.appendLine(
                `${this.level === TraceLevel.Debug ? this.timestamp : ''} ${message ?? ''}\n${String(err)}`,
            );
        }
    }

    static close() {
        if (this.output !== undefined) {
            this.output.dispose();
            this.output = undefined;
        }
    }

    private static get timestamp(): string {
        const now = new Date();
        return `[${now.toISOString().replace(/T/, ' ').replace(/\..+/, '')}:${`00${now.getUTCMilliseconds()}`.slice(
            -3,
        )}]`;
    }
}
