/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { ConfigurationChangeEvent, Disposable, StatusBarAlignment, StatusBarItem, ThemeColor, window } from 'vscode';
import { UtilCommands } from './commands/common';
import { configuration } from './configuration/config';
import { defaults } from './configuration/defaults';
import { Logger } from './logger';

export interface StatusBars {
    treeStatusBar?: StatusBarItem | undefined;
    unitsBar?: StatusBarItem | undefined;
    machineTypeBar?: StatusBarItem | undefined;
    support?: StatusBarItem | undefined;
}

export type StatusBar = keyof StatusBars;

const sb = {
    enabled: 'general.statusBars.enabled',
    aligh: 'general.statusBars.alignment',
};

export class StatusBarControl implements Disposable {
    private _enabled: boolean;
    private _align: StatusBarAlignment;
    private readonly _disposable: Disposable | undefined;

    // Status Bars
    private _statusBars: StatusBars;

    constructor() {
        this._disposable = Disposable.from(configuration.onDidChange(this.onConfigurationChanged, this));

        this._enabled = configuration.getParam(sb.enabled) ?? defaults.general.statusBars.enabled;

        this._statusBars = {
            treeStatusBar: undefined,
            unitsBar: undefined,
            machineTypeBar: undefined,
            support: undefined,
        };

        this._align = configuration.getParam(sb.aligh) ?? defaults.general.statusBars.alignment;

        if (this._enabled) {
            Logger.log('Loading Status Bars...');

            Object.keys(this._statusBars).forEach(key => {
                this._statusBars[key as keyof StatusBars] = window.createStatusBarItem(
                    this._align,
                    (this._align = StatusBarAlignment.Left ? 1 : 999),
                );
            });

            this.showStatusBars();
        }
    }

    dispose() {
        Object.keys(this._statusBars).forEach(key => {
            this._statusBars[key as keyof StatusBars]?.dispose();
        });

        this._disposable && this._disposable.dispose();
    }

    private onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, sb.enabled)) {
            if (this._enabled) {
                // Disable & Dispose
                Object.keys(this._statusBars).forEach(key => {
                    this._statusBars[key as keyof StatusBars]?.dispose();
                });
            } else {
                // Enable
                Object.keys(this._statusBars).forEach(key => {
                    this._statusBars[key as keyof StatusBars] = window.createStatusBarItem(
                        this._align,
                        this._align === StatusBarAlignment.Left ? 1 : 999,
                    );
                });

                this.showStatusBars();
            }

            this._enabled = configuration.getParam(sb.enabled) ?? defaults.general.statusBars.enabled;

            this._align = configuration.getParam(sb.aligh) ?? defaults.general.statusBars.alignment;
        } else {
            return;
        }
    }

    updateStatusBar(
        message: string,
        bar: StatusBar,
        tooltip?: string,
        color?: string | ThemeColor,
        cmd?: UtilCommands | string,
    ): boolean {
        if (!this._enabled) {
            return false;
        } else {
            if (this._statusBars !== undefined && bar in this._statusBars) {
                // Set Text
                this._statusBars[bar]!.text = message;

                // Set Tooltip
                if (tooltip) {
                    this._statusBars[bar]!.tooltip = tooltip;
                } else {
                    this._statusBars[bar]!.tooltip = undefined;
                }

                // Set Color
                if (color) {
                    this._statusBars[bar]!.color = color;
                } else {
                    this._statusBars[bar]!.color = undefined;
                }

                // Set Command
                if (cmd) {
                    this._statusBars[bar]!.command = cmd;
                } else {
                    this._statusBars[bar]!.command = undefined;
                }

                // Show Bars
                this.showStatusBars();

                return true;
            } else {
                return false;
            }
        }
    }

    showStatusBars() {
        Object.keys(this._statusBars).forEach(key => {
            this._statusBars[key as keyof StatusBars]?.show();
        });
    }

    hideStatusBars() {
        Object.keys(this._statusBars).forEach(key => {
            this._statusBars[key as keyof StatusBars]?.hide();
        });
    }
}
