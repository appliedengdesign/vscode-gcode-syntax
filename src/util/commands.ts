/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { 
    commands, 
    Disposable, 
    ExtensionContext, 
} from "vscode";
import { constants } from "./constants";
import { Messages } from "./messages";


export const enum Commands {
    GCSHOWSETTIGNS = 'gcode.showSettings',
    GCSTATSENABLE = 'gcode.views.stats.enable',
    GCSTATSREFRESH = 'gcode.views.stats.refresh',
    GCSUPPORT = 'gcode.supportGCode',
    GCTREEREFRESH = 'gcode.views.navTree.refresh',
    GCTREESELECT = 'gcode.gcodeTree.selection'
}

export abstract class GCommand implements  Disposable{

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

        context.subscriptions.push(
            new SupportGCodeCmd(),
            new ShowGCodeSettings()
        );
    }
}

class SupportGCodeCmd extends GCommand {

    constructor() {
        super(Commands.GCSUPPORT);
    }
    
    execute() {
        return Messages.showSupportGCodeMessage();
    }
}

class ShowGCodeSettings extends GCommand {

    constructor() {
        super(Commands.GCSHOWSETTIGNS);
    }

    execute() {
        commands.executeCommand('workbench.action.openSettings', '@ext:' + constants.extensionQualifiedID);
    }
}