/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { commands, Disposable } from 'vscode';

export const enum UtilCommands {
    ShowGCodeSettings = 'gcode.showSettings',
    ShowSupportGCode = 'gcode.supportGCode',
    AddComment = 'gcode.addComment',
    RemoveComment = 'gcode.removeComment',
}

export abstract class GCommand implements Disposable {
    private _disposable: Disposable;

    constructor(cmd: UtilCommands) {
        this._disposable = commands.registerCommand(cmd, (...args: any[]) => this._execute(cmd, ...args), this);

        return;
    }

    dispose() {
        this._disposable && this._disposable.dispose();
    }

    abstract execute(...args: any[]): any;

    protected _execute(cmd: string, ...args: any[]): void {
        this.execute(...args);
    }
}
