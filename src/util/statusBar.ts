/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { 
    ConfigurationChangeEvent,
    Disposable,
    ExtensionContext, 
    StatusBarAlignment, 
    StatusBarItem, 
    window 
} from "vscode";
import { configuration } from "./config";
import { Logger } from "./logger";

export interface StatusBars {
    treeStatusBar?: StatusBarItem | undefined;
    unitsBar?: StatusBarItem | undefined;
}

export type StatusBar = keyof StatusBars;


export class StatusBarControl implements Disposable {
    private _enabled: boolean;
    private _align: StatusBarAlignment;
    private readonly _disposable: Disposable | undefined;

    // Status Bars
    private _statusBars: StatusBars;

    constructor (private context: ExtensionContext) {

        this._disposable = Disposable.from(configuration.onDidChange(this.onConfigurationChanged, this));

        this. _enabled = configuration.getParam('general.statusBars.enabled');

        this._statusBars = {
            treeStatusBar: undefined,
            unitsBar: undefined
        };

        this._align = 
            configuration.getParam('general.statusBars.alignment') === 'Left' ?
            StatusBarAlignment.Left : StatusBarAlignment.Right;

        if (this._enabled) {

            Logger.log('Loading Status Bars...');

            Object.keys(this._statusBars).forEach((key) => {
                this._statusBars[key as keyof StatusBars] = window.createStatusBarItem(
                    this._align,
                    this._align = StatusBarAlignment.Left ? 1 : 999
                );
            });

            this.showStatusBars();

        }
    }

    dispose() {
        
        Object.keys(this._statusBars).forEach((key) => {
            this._statusBars[key as keyof StatusBars]?.dispose();
        });

        this._disposable && this._disposable.dispose();
    }

    private onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, 'general.statusBars.enabled')) {

            if (this._enabled) {

                // Disable & Dispose
                Object.keys(this._statusBars).forEach((key) => {
                    this._statusBars[key as keyof StatusBars]?.dispose();
                });

            } else {

                // Enable
                Object.keys(this._statusBars).forEach((key) => {
                    this._statusBars[key as keyof StatusBars] = window.createStatusBarItem(
                        this._align,
                        this._align = StatusBarAlignment.Left ? 1 : 999
                    );
                });

                this.showStatusBars();
                

            }

            this._enabled = configuration.getParam('general.statusBars.enabled');
            
            this._align = 
            configuration.getParam('general.statusBars.alignment') === 'Left' ?
            StatusBarAlignment.Left : StatusBarAlignment.Right;

        } else {
            return;
        }

        
    }

    updateStatusBar(message: string, bar: StatusBar): void {

        if (!this._enabled) {
            return;
        } else {

            if (this._statusBars !== undefined && bar in this._statusBars) {
                this._statusBars[bar]!.text = message;
                this.showStatusBars();
            }
        }
    }

    showStatusBars() {
        Object.keys(this._statusBars).forEach((key) => {
            this._statusBars[key as keyof StatusBars]?.show();
        });
    }

    hideStatusBars() {
        Object.keys(this._statusBars).forEach((key) => {
            this._statusBars[key as keyof StatusBars]?.hide();
        });
    }


}