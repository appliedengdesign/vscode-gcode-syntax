/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { 
    ConfigurationChangeEvent,
    Disposable,
    ExtensionContext, 
    TextDocumentChangeEvent, 
    TextEditor, 
    window,
    workspace
} from "vscode";
import { Control } from "./control";
import { Commands } from "./util/commands";
import { configuration } from "./util/config";
import { Logger } from "./util/logger";
import { StatusBar, StatusBarControl } from "./util/statusBar";



export const enum GCodeUnits {
    INCH = "Inch",
    MM = "Metric",
    AUTO = "Auto",
    DEF = "Defautlt (Inch)"
}

export class GCodeUnitsController implements Disposable {

    private readonly _disposable: Disposable | undefined;
    private _editor: TextEditor | undefined;
    private _statusbar: StatusBarControl;
    private readonly unitsStatusBar: StatusBar = 'unitsBar';
    private  _units: GCodeUnits;
    private _auto: boolean;

    constructor() {

        //this._disposable = Disposable.from(configuration.onDidChange(this.onConfigurationChanged, this));

        this._statusbar = Control.statusBarController;

        this. _auto = (this._units = configuration.getParam('general.units')) === GCodeUnits.AUTO;
        
        this._statusbar.updateStatusBar(this._units, this.unitsStatusBar);

        Control.context.subscriptions.push(configuration.onDidChange(this.onConfigurationChanged, this));
        Control.context.subscriptions.push(window.onDidChangeActiveTextEditor( () => this.onActiveEditorChanged()));
        Control.context.subscriptions.push(workspace.onDidChangeTextDocument(e => this.onDocumentChanged(e), this));
    }

    dispose() {
        this._disposable && this._disposable.dispose();
    }

    private onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, 'general.units')) {
            if ((this._units = configuration.getParam('general.units')) !== 'Auto') {
                
                Logger.log('Units: ' + this._units);
                this._auto = false;
                this._statusbar.updateStatusBar(this._units, this.unitsStatusBar, undefined, undefined, Commands.GCSHOWSETTIGNS);

            } else {
                Logger.log('Units: ' + this._units);
                this._auto = true;
                this._statusbar.updateStatusBar(this._units, this.unitsStatusBar, undefined, undefined, Commands.GCSHOWSETTIGNS);
            }
        }
    }

    private onActiveEditorChanged(): void {
       
        if ((this._editor = window.activeTextEditor) && this._editor.document.uri.scheme === 'file') {
            

            if (this._auto) {

                const text = this._editor.document.getText();

                // Parse doc for units
                this._units = this.parseUnits(text);

                // Update Status Bar
                this._statusbar.updateStatusBar(this._units, this.unitsStatusBar, undefined, undefined, Commands.GCSHOWSETTIGNS);

            } else {
                return;
            }
        }
    }

    private onDocumentChanged(changeEvent: TextDocumentChangeEvent): void {

        if ((this._editor = window.activeTextEditor) && this._editor.document.uri.scheme === 'file') {

            if (this._auto) {

                const text = this._editor.document.getText();
                // Parse doc for units
                this._units = this.parseUnits(text);

                // Update Status Bar
                this._statusbar.updateStatusBar(this._units, this.unitsStatusBar, undefined, undefined, Commands.GCSHOWSETTIGNS);
            } else {
                return;
            }
        }
    }

    private parseUnits(text: string): GCodeUnits {
        
        const reUnits = /(G20)|(G21)/im;
        
        const units = text.match(reUnits);
        // Check for Inch
        if (units === null) {
            return GCodeUnits.DEF;
        } else if (units[0] === 'G21') {
            return GCodeUnits.MM;
        } else {
            return GCodeUnits.INCH;
        }
    }
    
}