/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { 
    ConfigurationChangeEvent,
    Disposable,
    ExtensionContext, 
    window
} from "vscode";
import { Control } from "./control";
import { configuration } from "./util/config";
import { Logger } from "./util/logger";
import { StatusBar, StatusBarControl } from "./util/statusBar";



export enum GCodeUnits {
    INCH = 'Inch',
    MM = 'Metric'
}

export const defUnits = GCodeUnits.INCH;


export class GCodeUnitsController implements Disposable {

    private readonly _disposable: Disposable | undefined;
    private _statusbar: StatusBarControl;
    private readonly unitsStatusBar: StatusBar = 'unitsBar';
    private _units: GCodeUnits;

    constructor(private context: ExtensionContext) {

        this._disposable = Disposable.from(configuration.onDidChange(this.onConfigurationChanged, this));

        this._statusbar = Control.statusBarController;

        this._units = configuration.getParam('general.units');
        
        this._statusbar.updateStatusBar(this._units, this.unitsStatusBar);
    }

    dispose() {
        this._disposable && this._disposable.dispose();
    }

    private onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, 'general.units')) {
            if ((this._units = configuration.getParam('general.units')) !== 'Auto') {
                
                Logger.log('Units: ' + this._units);
                this._statusbar.updateStatusBar(this._units, this.unitsStatusBar);

            } else {
                Logger.log('Units: ' + this._units);
                return;
            }
        }
    }

    private onActiveEditorChanged(): void {
        if (window.activeTextEditor) {
            const editor = window.activeTextEditor;
        }
    }

    private getUnits(text: string): GCodeUnits {
        
        const reInch = /(G20)/igm;
        const reMM = /(G21)/igm;

        // Check for Inch
        if (text.match(reInch)) {
            return GCodeUnits.INCH;
        } else if (text.match(reMM)) {
            return GCodeUnits.MM;
        } else {
            return defUnits;
        }
    }
    
}