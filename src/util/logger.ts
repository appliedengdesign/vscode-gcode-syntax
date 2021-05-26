/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';
import { ConfigurationChangeEvent, ExtensionContext, OutputChannel, window } from 'vscode';
import { configuration } from './configuration/config';
import { defaults, TraceLevel } from './configuration/defaults';
import { constants } from './constants';

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
        if (this.level !== TraceLevel.Debug) {
            return;
        }

        if (this.output !== undefined) {
            this.output.appendLine(message);
        }
    }

    static error(err: Error, message?: string, handled = false): void {
        console.error(`${handled ? 'H' : 'Unh'}andled Error: ${err.stack || err.message || err.toString()}`);

        if (this.level === TraceLevel.Silent) {
            return;
        }

        if (!err) {
            return;
        }

        if (this.output !== undefined) {
            this.output.appendLine(
                `${handled ? 'H' : 'Unh'}andled Error: ${err.stack || err.message || err.toString()}`,
            );
        }
    }

    static log(message: string): void {
        if (this.level === TraceLevel.Verbose || this.level === TraceLevel.Debug) {
            if (this.output !== undefined) {
                this.output.appendLine(`${this.level === TraceLevel.Debug ? this.timestamp : ''} ${message}`);
            }
        }
    }

    static warn(message: string): void {
        if (this.level === TraceLevel.Silent) {
            return;
        }

        if (this.output !== undefined) {
            this.output.appendLine(message);
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
