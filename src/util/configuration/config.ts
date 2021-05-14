/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';
import {
    ConfigurationChangeEvent,
    ConfigurationScope,
    Event,
    EventEmitter,
    ExtensionContext,
    extensions,
    StatusBarAlignment,
    workspace,
} from 'vscode';
import { constants } from '../constants';
import { Logger, TraceLevel } from '../logger';
import { LineNumberFrequency } from '../lineNumberer';

import { GCodeUnits } from '../../gcodeUnits';

export interface GCodeConfiguration {
    general: {
        machineType: 'Mill' | 'Lathe' | '3D Printer';

        hovers: {
            enabled: boolean;
        };

        statusBars: {
            enabled: boolean;
            alignment: StatusBarAlignment;
        };

        units: GCodeUnits;

        outputLevel: TraceLevel;
    };

    lineNumberer: {
        addSpaceAfter: boolean;
        frequency: LineNumberFrequency;
        ignoreBlank: boolean;
        ignoreProgramNumbers: boolean;
    };

    views: {
        maxAutoRefresh: number;

        navTree: {
            autoRefresh: boolean;
        };

        stats: {
            autoRefresh: boolean;
        };
    };

    webviews: {
        enabled: boolean;
    };
}

export const defaults: GCodeConfiguration = {
    general: {
        machineType: 'Mill',
        hovers: {
            enabled: true,
        },
        statusBars: {
            enabled: true,
            alignment: StatusBarAlignment.Left,
        },
        units: GCodeUnits.Auto,
        outputLevel: TraceLevel.Verbose,
    },
    lineNumberer: {
        addSpaceAfter: true,
        frequency: LineNumberFrequency.EveryLine,
        ignoreBlank: true,
        ignoreProgramNumbers: true,
    },
    views: {
        maxAutoRefresh: 10000,
        navTree: {
            autoRefresh: true,
        },
        stats: {
            autoRefresh: false,
        },
    },
    webviews: {
        enabled: true,
    },
};

export class Config {
    private static _defaults: GCodeConfiguration;
    private _onDidChange = new EventEmitter<ConfigurationChangeEvent>();
    get onDidChange(): Event<ConfigurationChangeEvent> {
        return this._onDidChange.event;
    }

    static initialize(context: ExtensionContext, cfg: Config) {
        context.subscriptions.push(workspace.onDidChangeConfiguration(cfg.onConfigurationChanged, cfg));
    }

    private onConfigurationChanged(e: ConfigurationChangeEvent) {
        Logger.log('Configuration changed...');

        this._onDidChange.fire(e);
    }

    getParam<T>(param: string, scope?: ConfigurationScope, defaultValue?: T): T | undefined {
        return defaultValue === undefined
            ? workspace.getConfiguration(constants.configId, scope).get<T>(param)
            : workspace.getConfiguration(constants.configId, scope).get<T>(param, defaultValue);
    }

    // Set Parameter
    async setParam(param: string, value: any, global = true, scope?: ConfigurationScope): Promise<boolean> {
        try {
            await workspace.getConfiguration(constants.configId, scope).update(param, value, global);
        } catch (err) {
            Logger.log('Error updating configuration');
            return false;
        }

        return this.getParam(param) === value;
    }

    changed(e: ConfigurationChangeEvent, section: string, scope?: ConfigurationScope): boolean {
        return e.affectsConfiguration(`${constants.configId}.${section}`, scope) ?? true;
    }

    static get defaults() {
        return this._defaults;
    }

    private buildDefaults() {
        const gcode = extensions.getExtension(constants.extensionQualifiedId);

        if (gcode) {
            const pkgCfg = gcode.packageJSON.contrubutes.configuration;
        }
    }
}

export const configuration = new Config();

export const cfg = new Proxy(defaults, {
    get: function (name: GCodeConfiguration, prop: string): string | undefined {
        if (!(prop in name)) {
            return undefined;
        }
    },
});

cfg.general.machineType;
