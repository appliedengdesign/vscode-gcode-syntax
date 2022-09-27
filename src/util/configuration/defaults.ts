/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { StatusBarAlignment } from 'vscode';
import { GCodeUnits } from '../constants';
import { LineNumbererOptions, LineNumberFrequency } from '../lineNumberer';
import { MachineType, MachineTypes } from '@appliedengdesign/gcode-reference';

export enum TraceLevel {
    Silent = 'silent',
    Errors = 'errors',
    Warnings = 'warnings',
    Verbose = 'verbose',
    Debug = 'debug',
}

export interface GCodeConfiguration {
    general: {
        machineType: MachineType;

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

    lineNumberer: LineNumbererOptions;

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
        calc: {
            enabled: boolean;
        };
    };
}

export const defaults: GCodeConfiguration = {
    general: {
        machineType: MachineTypes.Mill,
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
        defaultIncrement: 10,
        defaultStart: 10,
        enableQuickPick: true,
        frequency: LineNumberFrequency.EveryLine,
        ignoreBlank: true,
        ignoreComments: true,
        ignoreExtra: [],
        ignoreProgramNumbers: true,
        matchLineNumber: false,
        showProgress: true,
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
        calc: {
            enabled: true,
        },
    },
};
