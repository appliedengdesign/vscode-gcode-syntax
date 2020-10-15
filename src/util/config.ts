/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { WorkspaceConfiguration, workspace, ExtensionContext, ConfigurationChangeEvent } from "vscode";
import { constants } from './constants';
import { Logger } from "./logger";

type IgcodeSettings = {
    colorization: boolean;
    machine: string;
    trAutoRef: boolean;
    statsEnabled: boolean;
}


export class Config {
    private  config: WorkspaceConfiguration;
    //private settings: IgcodeSettings;

    static configure(context: ExtensionContext) {
        context.subscriptions.push(
            workspace.onDidChangeConfiguration(configuration.onConfigurationChanged, configuration)
        );
    }

    constructor() {
        // Static reference to configuration
        this.config = workspace.getConfiguration(constants.configId);
        
        // Initialize
        
    }

    private onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (!e.affectsConfiguration(constants.configId)) {
            Logger.log('Configuration Updated.');
            this.reloadConfig();
        }
    }

    private reloadConfig() {
        this.config = workspace.getConfiguration(constants.configId);
    } 

    getParam(param: string): any {
        this.reloadConfig();
        return this.config.get(param);
    }

    setParam( param: string, value: any, global = true): boolean {
        
        try {
            this.config.update(param, value, global);
        }
        catch (err) {
            Logger.log('Error updating configuration');
            return false;
        }

        this.reloadConfig();

        if (this.config !== undefined) {
            return true;
        } else return false;
    }

}

export const configuration = new Config();