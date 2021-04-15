/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { ConfigurationChangeEvent, Disposable, Event, EventEmitter, workspace } from 'vscode';
import { GReference, MachineTypes } from '@appliedengdesign/gcode-reference';
import { configuration } from './config';
import { Logger } from './logger';

export class MachineTypeControl implements Disposable {
    private readonly _dispoable: Disposable | undefined;
    private _machineType: MachineTypes | undefined;
    private _gReference: GReference;

    private _onDidChange = new EventEmitter<ConfigurationChangeEvent>();
    get onDidChange(): Event<ConfigurationChangeEvent> {
        return this._onDidChange.event;
    }

    constructor() {
        this.update();
        this._gReference = new GReference(this._machineType);

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
    }

    get gReference() {
        return this._gReference;
    }
}
