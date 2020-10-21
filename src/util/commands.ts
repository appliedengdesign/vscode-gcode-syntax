/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { 
    commands, 
    Disposable, 
    ExtensionContext 
} from "vscode";
import { Messages } from "./messages";

enum Commands {

    GCSUPPORT = 'gcode.supportGCode'
}

export abstract class Command implements Disposable{

    private _disposable: Disposable;

    constructor(cmd: Commands) {

        this._disposable = commands.registerCommand(
            cmd,
            (...args: any[]) => this._execute(cmd, ...args),
            this
        );

        return;
    }

    dispose() {
        this._disposable && this._disposable.dispose();
    }

    abstract execute(...args: any[]): any

    protected _execute(cmd: string, ...args: any[]): any {
        this.execute(...args);
    }

    static registerCommands(context: ExtensionContext): void {

        context.subscriptions.push(new supportGCodeCmd());
    }
}

class supportGCodeCmd extends Command {

    constructor() {
        super(Commands.GCSUPPORT);
    }
    
    execute() {
        return Messages.showSupportGCodeMessage();
    }
}