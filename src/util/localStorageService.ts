/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

export type LSSState = 'global' | 'workspace';

import { ExtensionContext, Memento } from 'vscode';

export class LocalStorageService {
    private _wsState: Memento;
    private _globalState: Memento;

    constructor(context: ExtensionContext) {
        this._wsState = context.workspaceState;
        this._globalState = context.globalState;
    }

    public getValue<T>(key: string, loc: LSSState): T | undefined {
        if (loc === 'workspace') {
            return this._wsState.get<T>(key);
        } else {
            return this._globalState.get<T>(key);
        }
    }

    public async setValue<T>(key: string, value: T, loc: LSSState) {
        if (loc === 'workspace') {
            await this._wsState.update(key, value);
        } else {
            await this._globalState.update(key, value);
        }
    }
}
