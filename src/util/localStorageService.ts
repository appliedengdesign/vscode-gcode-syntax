/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

export const enum StorageLocations {
    Global = 'global',
    WorkSpace = 'workspace',
}

export type StorageLocation = StorageLocations;

import { ExtensionContext, Memento } from 'vscode';
import { Logger } from './logger';

export class LocalStorageService {
    private _wsState: Memento;
    private _globalState: Memento;

    constructor(private readonly context: ExtensionContext) {
        this._wsState = context.workspaceState;
        this._globalState = context.globalState;
    }

    public getValue<T>(key: string, loc: StorageLocation): T | undefined {
        if (loc === StorageLocations.WorkSpace) {
            return this._wsState.get<T>(key);
        } else {
            return this._globalState.get<T>(key);
        }
    }

    public async setValue<T>(key: string, value: T, loc: StorageLocation): Promise<void> {
        if (loc === StorageLocations.WorkSpace) {
            try {
                await this._wsState.update(key, value);
            } catch (reason) {
                Logger.error(<Error>reason);
            }
        } else {
            try {
                await this._globalState.update(key, value);
            } catch (reason) {
                Logger.error(<Error>reason);
            }
        }
    }

    public async deleteValue(key: string, loc: StorageLocation): Promise<void> {
        if (loc === StorageLocations.WorkSpace) {
            try {
                await this._wsState.update(key, undefined);
            } catch (reason) {
                Logger.error(<Error>reason);
            }
        } else {
            try {
                await this._globalState.update(key, undefined);
            } catch (reason) {
                Logger.error(<Error>reason);
            }
        }
    }
}
