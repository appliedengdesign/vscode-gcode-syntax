/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { StatusBarAlignment } from 'vscode';
import { GCodeUnits } from '../../gcodeUnits';
import { LineNumberFrequency } from '../lineNumberer';

export enum TraceLevel {
    Silent = 'silent',
    Errors = 'errors',
    Verbose = 'verbose',
    Debug = 'debug',
}

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

        webviews: {
            enabled: boolean;
        };
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
        webviews: {
            enabled: true,
        },
    },
};
