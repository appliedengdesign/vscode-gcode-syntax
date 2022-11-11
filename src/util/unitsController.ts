/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import {
    ConfigurationChangeEvent,
    Disposable,
    Event,
    EventEmitter,
    TextDocumentChangeEvent,
    TextEditor,
    window,
    workspace,
} from 'vscode';
import { Control } from '../control';
import { configuration } from './configuration/config';
import { defaults } from './configuration/defaults';
import { GCodeUnits, GCommands } from './constants';
import { Logger } from './logger';
import { StatusBar, StatusBarControl } from './statusBar';

type Units = GCodeUnits.Inch | GCodeUnits.MM | GCodeUnits.Default;

export const cfgUnits = 'general.units';

export class UnitsController implements Disposable {
    private readonly _disposables: Disposable[] = [];
    private readonly unitsStatusBar: StatusBar = 'unitsBar';
    private _editor: TextEditor | undefined;
    private _statusbar: StatusBarControl;
    private _units: Units;
    private _auto: boolean;

    private _onDidChangeUnits: EventEmitter<Units> = new EventEmitter<Units>();
    get onDidChangeUnits(): Event<Units> {
        return this._onDidChangeUnits.event;
    }

    constructor() {
        Logger.log('Loading Units Controller...');

        this._statusbar = Control.statusBarController;

        const units = <GCodeUnits>configuration.getParam(cfgUnits) ?? defaults.general.units;
        if (units === GCodeUnits.Auto) {
            this._auto = true;
            this._units = GCodeUnits.Default;
        } else {
            this._auto = false;
            this._units = units;
        }

        this.updateStatusBar();

        this._disposables.push(
            configuration.onDidChange(this.onConfigurationChanged, this),
            window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged()),
            workspace.onDidChangeTextDocument(e => this.onDocumentChanged(e), this),
        );
    }

    dispose() {
        Disposable.from(...this._disposables).dispose();
    }

    get units(): Units {
        return this._units;
    }

    private onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, cfgUnits)) {
            const units = <GCodeUnits>configuration.getParam(cfgUnits) ?? defaults.general.units;
            if (units !== GCodeUnits.Auto) {
                // Update Units
                this._units = units;
                Logger.log(`Units: ${this._units}`);

                // Set Auto False
                this._auto = false;

                this.updateStatusBar();

                // Fire Units Change Event
                this._onDidChangeUnits.fire(this._units);
            } else {
                // Units = Auto
                Logger.log('Units: Auto');

                // Set Auto True
                this._auto = true;
            }
        }
    }

    private onActiveEditorChanged(): void {
        if ((this._editor = window.activeTextEditor) && this._editor.document.uri.scheme === 'file') {
            if (this._auto) {
                const text = this._editor.document.getText();

                // Parse doc for units
                const newUnits = this.parseUnits(text);

                if (newUnits === this._units) {
                    return;
                } else {
                    this._units = newUnits;

                    // Update Statusbar
                    this.updateStatusBar();

                    // Fire Units Change Event
                    this._onDidChangeUnits.fire(this._units);
                }
            } else {
                return;
            }
        }
    }

    private onDocumentChanged(_changeEvent: TextDocumentChangeEvent): void {
        if ((this._editor = window.activeTextEditor) && this._editor.document.uri.scheme === 'file') {
            if (this._auto) {
                const text = this._editor.document.getText();

                // Parse doc for units
                const newUnits = this.parseUnits(text);

                if (newUnits === this._units) {
                    return;
                } else {
                    this._units = newUnits;

                    // Update Statusbar
                    this.updateStatusBar();

                    // Fire Units Change Event
                    this._onDidChangeUnits.fire(this._units);
                }
            } else {
                return;
            }
        }
    }

    private updateStatusBar(): void {
        let tooltip = `${this._units}`;
        let units = `${this.units}`;
        if (this._auto && this._units !== GCodeUnits.Default) {
            this._units === GCodeUnits.Inch
                ? (tooltip = `${tooltip} (G20 Found)`)
                : (tooltip = `${tooltip} (G21 Found)`);

            units = `${units} (Auto)`;
        }
        this._statusbar.updateStatusBar(units, this.unitsStatusBar, tooltip, undefined, GCommands.ShowGCodeSettings);
    }

    private parseUnits(text: string): Units {
        const reUnits = /(G20)|(G21)/im;

        const units = reUnits.exec(text);

        // Check for Inch
        if (units === null) {
            return GCodeUnits.Default;
        } else if (units[0] === 'G21') {
            return GCodeUnits.MM;
        } else {
            return GCodeUnits.Inch;
        }
    }
}
