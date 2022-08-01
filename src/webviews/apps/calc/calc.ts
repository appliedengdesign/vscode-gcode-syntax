/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

interface RPMCalc {
    btn: HTMLElement;
    sfm: HTMLInputElement;
    toolDia: HTMLInputElement;
    results: HTMLInputElement;
}

export class CalcApp {
    private _rpmCalc: RPMCalc;

    constructor() {
        this._rpmCalc = {
            btn: document.getElementById('rpm-calc')!,
            sfm: document.getElementById('sfm')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            toolDia: document.getElementById('tool-dia')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            results: document.getElementById('rpm-results')?.shadowRoot?.getElementById('control') as HTMLInputElement,
        };

        this._rpmCalc.btn.addEventListener('click', this.calcRPM.bind(this), false);
    }

    private calcRPM(): void {
        const sfm = Number(this._rpmCalc.sfm.value);
        const toolDia = Number(this._rpmCalc.toolDia.value);

        const results = Math.round((sfm * 12) / Math.PI / toolDia);

        this._rpmCalc.results.value = results.toString();
    }
}

new CalcApp();
