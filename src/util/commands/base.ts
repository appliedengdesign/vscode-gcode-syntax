/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { commands, Disposable } from 'vscode';
import { GCommands } from '../constants';

export abstract class GCommand implements Disposable {
    private readonly _disposable: Disposable;

    constructor(cmd: GCommands | GCommands[]) {
        if (typeof cmd === 'string') {
            this._disposable = commands.registerCommand(cmd, (...args: any[]) => this._execute(cmd, ...args), this);

            return;
        }

        const subscriptions = cmd.map(cmd =>
            commands.registerCommand(cmd, (...args: any[]) => this._execute(cmd, ...args), this),
        );
        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable && this._disposable.dispose();
    }

    abstract execute(...args: any[]): any;

    protected _execute(cmd: string, ...args: any[]): void {
        this.execute(...args);
    }
}
