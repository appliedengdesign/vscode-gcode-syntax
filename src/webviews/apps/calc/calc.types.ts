/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { MachineTypes } from '@appliedengdesign/gcode-reference/dist/types';

export interface ICalcDom {
    rpm?: {
        btn: HTMLElement;
        sfm: HTMLInputElement;
        toolDia: HTMLInputElement;
        results: HTMLSpanElement;
    };

    sfm?: {
        btn: HTMLElement;
        rpm: HTMLInputElement;
        toolDia: HTMLInputElement;
        results: HTMLSpanElement;
    };

    feedrate?: {
        btn: HTMLElement;
        rpm: HTMLInputElement;
        numFlutes: HTMLInputElement;
        chipLoad: HTMLInputElement;
        results: HTMLSpanElement;
    };

    chipLoad?: {
        btn: HTMLElement;
        ipm: HTMLInputElement;
        rpm: HTMLInputElement;
        numFlutes: HTMLInputElement;
        results: HTMLSpanElement;
    };
}

export type TCalcDom = ICalcDom[keyof ICalcDom];

export interface calcBootstrap {
    machineType: MachineTypes;
    units: Units;
}

export enum Units {
    Inch = 'Inch',
    MM = 'Metric',
    Default = 'Default (Inch)',
}
