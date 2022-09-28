/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

export interface ICalcDom {
    rpm?: {
        btn: HTMLElement;
        speed: HTMLInputElement;
        toolDia: HTMLInputElement;
        results: HTMLSpanElement;
    };

    speed?: {
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
        feedRate: HTMLInputElement;
        rpm: HTMLInputElement;
        numFlutes: HTMLInputElement;
        results: HTMLSpanElement;
    };

    mrr?: {
        btn: HTMLElement;
        axialDepth: HTMLInputElement;
        radialDepth: HTMLInputElement;
        feedRate: HTMLInputElement;
        results: HTMLSpanElement;
    };

    finish?: {
        btn: HTMLElement;
        radius: HTMLInputElement;
        feedRate: HTMLInputElement;
        results: HTMLSpanElement;
    };
}

export type TCalcDom = ICalcDom[keyof ICalcDom];

export enum MachineTypes {
    EDM = 'edm',
    Mill = 'mill',
    Lathe = 'lathe',
    Laser = 'laser',
    Printer = 'printer',
    Swiss = 'swiss',
}

export type MachineType = MachineTypes;

export enum Units {
    Inch = 'Inch',
    MM = 'Metric',
    Default = 'Default (Inch)',
}

export interface calcBootstrap {
    machineType: MachineTypes;
    units: Units;
}
