/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';
import { ConfigurationChangeEvent, ConfigurationScope, Event, EventEmitter, ExtensionContext, workspace } from 'vscode';
import { constants } from '../constants';
import { Logger } from '../logger';
export class Config {
    // private _config: WorkspaceConfiguration;

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
        // this._config = workspace.getConfiguration(constants.configId);
    }

    private onConfigurationChanged(e: ConfigurationChangeEvent) {
        Logger.log('Configuration changed...');

        this._onDidChange.fire(e);
    }

    private reloadConfig() {
        // this._config = workspace.getConfiguration(constants.configId);
    }

    // Get Parameter
    getParam<T>(param: string, scope?: ConfigurationScope, defaultValue?: T): T | undefined {
        // this.reloadConfig();
        return defaultValue === undefined
            ? workspace.getConfiguration(constants.configId, scope).get<T>(param)
            : workspace.getConfiguration(constants.configId, scope).get<T>(param, defaultValue);
    }

    // Set Parameter
    async setParam(param: string, value: any, global = true, scope?: ConfigurationScope): Promise<boolean> {
        try {
            await workspace.getConfiguration(constants.configId, scope).update(param, value, global);
        } catch (err) {
            Logger.log('Error updating configuration');
            return false;
        }

        // this.reloadConfig();

        return this.getParam(param) === value;
    }

    changed(e: ConfigurationChangeEvent, section: string, scope?: ConfigurationScope): boolean {
        // const section: string = <string>args[0];

        return e.affectsConfiguration(`${constants.configId}.${section}`, scope) ?? true;
    }
}

export const configuration = new Config();
