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
    static statusBar: StatusBarItem

    static configure(context: ExtensionContext) {
        this.statusBar = this.statusBar || window.createStatusBarItem( StatusBarAlignment.Right, 100 );

        context.subscriptions.push(this.statusBar);
    }

    static updateStatusBar(message: string): void {
        if (this.statusBar !== undefined) {
            this.statusBar.text = message;
            this.statusBar.show();
        }
    }

    static showStatusBar (): void {
        if (this.statusBar !== undefined) {
            this.statusBar.show();
        }
    }

    static hideStatusBar(): void {
        if (this.statusBar !== undefined) {
            this.statusBar.hide();
        }
    }

    static dispose(): void {
        if (this.statusBar !== undefined) {
            this.statusBar.dispose();
        }
    }
}