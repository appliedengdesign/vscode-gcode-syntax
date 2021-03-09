/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';
import {
    ConfigurationChangeEvent,
    Event,
    EventEmitter,
    ExtensionContext,
    workspace,
    WorkspaceConfiguration,
} from 'vscode';
import { constants } from './constants';
import { Logger } from './logger';
export class Config {
    private _config: WorkspaceConfiguration;

    private _onDidChange = new EventEmitter<ConfigurationChangeEvent>();
    get onDidChange(): Event<ConfigurationChangeEvent> {
        return this._onDidChange.event;
    }

    static initialize(context: ExtensionContext, cfg: Config) {
        context.subscriptions.push(workspace.onDidChangeConfiguration(cfg.onConfigurationChanged, cfg));
    }

    // Constructor
    constructor() {
        // Static reference to configuration
        this._config = workspace.getConfiguration(constants.configId);

        // Initialize
    }

    private onConfigurationChanged(e: ConfigurationChangeEvent) {
        Logger.log('Configuration changed...');

        this._onDidChange.fire(e);
    }

    private reloadConfig() {
        this._config = workspace.getConfiguration(constants.configId);
    }

    // Get Parameter
    getParam(param: string): unknown {
        this.reloadConfig();
        return this._config.get(param);
    }

    // Set Parameter
    async setParam(param: string, value: any, global = true): Promise<boolean> {
        try {
            await this._config.update(param, value, global);
        } catch (err) {
            Logger.log('Error updating configuration');
            return false;
        }

        this.reloadConfig();

        if (this._config !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    changed(e: ConfigurationChangeEvent, ...args: any[]) {
        const section: string = <string>args[0];

        return e.affectsConfiguration(`${constants.configId}.${section}`);
    }
}

export const configuration = new Config();
