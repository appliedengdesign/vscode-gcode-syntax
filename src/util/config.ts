/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { 
    WorkspaceConfiguration, 
    workspace, 
    ExtensionContext, 
    ConfigurationChangeEvent, 
    EventEmitter, 
    Event
} from "vscode";
import { constants } from './constants';
import { Logger } from "./logger";

export class Config {
    private  _config: WorkspaceConfiguration;

    private _onDidChange = new EventEmitter<ConfigurationChangeEvent>();
    readonly onDidChange: Event<ConfigurationChangeEvent> = this._onDidChange.event; 

    static initialize(context: ExtensionContext) {
        context.subscriptions.push(
            workspace.onDidChangeConfiguration(configuration.onConfigurationChanged, configuration)
        );
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
    getParam(param: string): any {
        this.reloadConfig();
        return this._config.get(param);
    }

    // Set Parameter
    setParam( param: string, value: any, global = true): boolean {
        
        try {
            this._config.update(param, value, global);
        }
        catch (err) {
            Logger.log('Error updating configuration');
            return false;
        }

        this.reloadConfig();

        if (this._config !== undefined) {
            return true;
        } else return false;
    }

    changed(e: ConfigurationChangeEvent, ...args: any[]) {
        const section: string = args[0];

        return e.affectsConfiguration(`${constants.configId}.${section}`);
    }

}

export const configuration = new Config();