/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { ConfigurationChangeEvent, Disposable, Event, EventEmitter, workspace } from 'vscode';
import { GReference, MachineTypes } from '@appliedengdesign/gcode-reference';
import { configuration } from './configuration/config';
import { Logger } from './logger';
import { StatusBar, StatusBarControl } from './statusBar';
import { Control } from '../control';
import { UtilCommands } from './commands/common';

export class MachineTypeControl implements Disposable {
    private readonly _dispoable: Disposable | undefined;
    private _machineType: MachineTypes | undefined;
    private _statusbar: StatusBarControl;
    private readonly mtypeStatusBar: StatusBar = 'machineTypeBar';
    private _gReference: GReference;

    private _onDidChange = new EventEmitter<ConfigurationChangeEvent>();
    get onDidChange(): Event<ConfigurationChangeEvent> {
        return this._onDidChange.event;
    }

    constructor() {
        this._statusbar = Control.statusBarController;
        this._gReference = new GReference();
        this.update();

        this._dispoable = Disposable.from(workspace.onDidChangeConfiguration(this.onConfigurationChanged, this));
    }

    dispose() {
        this._dispoable && this._dispoable.dispose();
    }

    private onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, 'general.machineType')) {
            this.update();
        } else {
            return;
        }
    }

    private update() {
        const cfgMachineType = <string>configuration.getParam('general.machineType');
        Logger.log(`Machine Type: ${cfgMachineType}`);
        switch (cfgMachineType) {
            case 'Mill':
                this._machineType = MachineTypes.Mill;
                break;

            case 'Lathe':
                this._machineType = MachineTypes.Lathe;
                break;

            case '3D Printer':
                this._machineType = MachineTypes.Printer;
                break;

            default:
                return;
        }

        this._statusbar.updateStatusBar(
            cfgMachineType,
            this.mtypeStatusBar,
            undefined,
            undefined,
            UtilCommands.ShowGCodeSettings,
        );

        this._gReference.setType(this._machineType);
    }

    get gReference() {
        return this._gReference;
    }
}
