/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { ExtensionContext } from 'vscode';
import { constants } from './constants';
import { LocalStorageService, StorageLocations } from './localStorageService';
import { Logger } from './logger';
import { Version } from './version';

export interface IState extends Record<string, unknown> {
    previousVersion: string;
    version: string;
}

export class StateControl {
    private defaults: IState = {
        previousVersion: '0.0.0',
        version: '0.0.0',
    };

    private _state: IState;
    private _storageManager: LocalStorageService;

    constructor(context: ExtensionContext) {
        Logger.log('Starting Local Storage Service...');
        this._storageManager = new LocalStorageService(context);
        this._state = this.getState();
    }

    private getState(): IState {
        return this._storageManager.getValue<IState>(constants.configId, StorageLocations.Global) ?? this.defaults;
    }

    async deleteState(): Promise<void> {
        await this._storageManager.deleteValue(constants.configId, StorageLocations.Global);
    }

    private async _writeState(): Promise<void> {
        await this._storageManager.setValue<IState>(constants.configId, this._state, StorageLocations.Global);
    }

    getVersion(): Version {
        return new Version(this._state.version);
    }

    async updateVer(ver: Version | string): Promise<void> {
        let newVer: Version;
        if (typeof ver === 'string') {
            newVer = new Version(ver);
        } else {
            newVer = ver;
        }

        this._state.previousVersion = this._state.version;
        this._state.version = newVer.getVersionAsString();

        await this._writeState();
    }
}
