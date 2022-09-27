/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { ConfigurationChangeEvent, Disposable, Event, EventEmitter } from 'vscode';
import { GReference, MachineType, MachineTypes } from '@appliedengdesign/gcode-reference';
import { configuration } from './configuration/config';
import { Logger } from './logger';
import { StatusBar, StatusBarControl } from './statusBar';
import { Control } from '../control';
import { GCommands } from './constants';
import { defaults } from './configuration/defaults';

export class MachineTypeController implements Disposable {
    private readonly _dispoables: Disposable[] = [];
    private _machineType: MachineTypes | undefined;
    private _statusbar: StatusBarControl;
    private readonly mtypeStatusBar: StatusBar = 'machineTypeBar';
    private _gReference: GReference;

    private _onDidChangeMachineType: EventEmitter<MachineType> = new EventEmitter<MachineType>();
    get onDidChangeMachineType(): Event<MachineType> {
        return this._onDidChangeMachineType.event;
    }

    constructor() {
        this._statusbar = Control.statusBarController;
        this._gReference = new GReference();
        this._update();

        this._dispoables.push(configuration.onDidChange(this._onConfigurationChanged, this));
    }

    dispose() {
        Disposable.from(...this._dispoables).dispose();
    }

    private _onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, 'general.machineType')) {
            this._update();
        } else {
            return;
        }
    }

    private _update() {
        const cfgMachineType = <string>configuration.getParam('general.machineType') ?? defaults.general.machineType;
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

            case 'Swiss':
                this._machineType = MachineTypes.Swiss;
                break;

            case 'Laser':
                this._machineType = MachineTypes.Laser;
                break;

            case 'EDM':
                this._machineType = MachineTypes.EDM;
                break;

            default:
                return;
        }

        // Update Status Bar
        this._statusbar.updateStatusBar(
            cfgMachineType,
            this.mtypeStatusBar,
            undefined,
            undefined,
            GCommands.ShowGCodeSettings,
        );

        // Update GReference
        this._gReference.setType(this._machineType);
    }

    get gReference() {
        return this._gReference;
    }

    get machineType() {
        return this._machineType;
    }
}
