/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { 
    ExtensionContext, 
    StatusBarAlignment, 
    StatusBarItem, 
    window 
} from "vscode";


export class StatusBar {
    private _statusBar: StatusBarItem

    constructor (private context: ExtensionContext, private align: StatusBarAlignment, priority: number) {
        this._statusBar = window.createStatusBarItem(
            align,
            priority
        );

        context.subscriptions.push(this._statusBar);
    }

    dispose() {
        if (this._statusBar !== undefined) {
            this._statusBar.dispose();
        }
    }

    updateStatusBar(message: string): void {
        if (this._statusBar !== undefined) {
            this._statusBar.text = message;
            this._statusBar.show();
        }
    }

    showStatusBar() {
        if (this._statusBar !== undefined) {
            this._statusBar.show();
        }
    }

    hideStatusBar() {
        if (this._statusBar !== undefined) {
            this._statusBar.hide();
        }
    }


}