/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

interface ICalcDom {
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

type TCalcDom = ICalcDom[keyof ICalcDom];

type Units = 'imperial' | 'metric';

export class CalcApp {
    private _calcDom: ICalcDom = {};
    private _units: Units = 'imperial';

    constructor() {
        this.populateDOM();

        this.registerBtns();
    }

    private populateDOM(): void {
        // Populate RPM Calculator
        this._calcDom.rpm = {
            btn: document.getElementById('rpm-calc-btn') as HTMLElement,
            sfm: document.getElementById('rpm-sfm')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            toolDia: document.getElementById('rpm-tool-dia')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            results: document.getElementById('rpm-results') as HTMLSpanElement,
        };

        // Populate SFM Calculator
        this._calcDom.sfm = {
            btn: document.getElementById('sfm-calc-btn') as HTMLElement,
            rpm: document.getElementById('sfm-rpm')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            toolDia: document.getElementById('sfm-tool-dia')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            results: document.getElementById('sfm-results') as HTMLSpanElement,
        };

        // Populate Feedrate Calculator
        this._calcDom.feedrate = {
            btn: document.getElementById('fr-calc-btn') as HTMLElement,
            rpm: document.getElementById('fr-rpm')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            numFlutes: document
                .getElementById('fr-num-flutes')
                ?.shadowRoot?.getElementById('control') as HTMLInputElement,
            chipLoad: document
                .getElementById('fr-chip-load')
                ?.shadowRoot?.getElementById('control') as HTMLInputElement,
            results: document.getElementById('fr-results') as HTMLSpanElement,
        };

        this._calcDom.chipLoad = {
            btn: document.getElementById('cl-calc-btn') as HTMLElement,
            ipm: document.getElementById('cl-ipm')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            rpm: document.getElementById('cl-rpm')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            numFlutes: document
                .getElementById('cl-num-flutes')
                ?.shadowRoot?.getElementById('control') as HTMLInputElement,
            results: document.getElementById('cl-results') as HTMLSpanElement,
        };
    }

    private registerBtns(): void {
        Object.keys(this._calcDom).forEach(key => {
            this._calcDom[key as keyof ICalcDom]?.btn.addEventListener('click', this.processEvent.bind(this), false);
        });
    }

    private processEvent(e: MouseEvent): void {
        const target = e.target as HTMLButtonElement;
        let result: number | undefined;

        if (target) {
            switch (target.id) {
                case 'rpm-calc-btn': {
                    if (this._calcDom.rpm) {
                        const sfm = Math.abs(Number(this._calcDom.rpm.sfm.value));
                        const toolDia = Math.abs(Number(this._calcDom.rpm.toolDia.value));

                        this._calcDom.rpm.sfm.value = sfm ? sfm.toString() : '';
                        this._calcDom.rpm.toolDia.value = toolDia ? sfm.toString() : '';

                        result = this.calcRPM(sfm, toolDia, this._units);

                        this.displayResults(result, this._calcDom.rpm);
                    }
                    break;
                }

                case 'sfm-calc-btn': {
                    if (this._calcDom.sfm) {
                        const rpm = Math.abs(Number(this._calcDom.sfm.rpm.value));
                        const toolDia = Math.abs(Number(this._calcDom.sfm.toolDia.value));

                        this._calcDom.sfm.rpm.value = rpm ? rpm.toString() : '';
                        this._calcDom.sfm.toolDia.value = toolDia ? toolDia.toString() : '';

                        result = this.calcSFM(rpm, toolDia, this._units);

                        this.displayResults(result, this._calcDom.sfm);
                    }
                    break;
                }

                case 'fr-calc-btn': {
                    if (this._calcDom.feedrate) {
                        const rpm = Math.abs(Number(this._calcDom.feedrate.rpm.value));
                        const numFlutes = Math.abs(Number(this._calcDom.feedrate.numFlutes.value));
                        const chipLoad = Math.abs(Number(this._calcDom.feedrate.chipLoad.value));

                        this._calcDom.feedrate.rpm.value = rpm ? rpm.toString() : '';
                        this._calcDom.feedrate.numFlutes.value = numFlutes ? numFlutes.toString() : '';
                        this._calcDom.feedrate.chipLoad.value = chipLoad ? chipLoad.toString() : '';

                        result = this.calcFeedRate(rpm, numFlutes, chipLoad);

                        this.displayResults(result, this._calcDom.feedrate);
                    }
                    break;
                }

                case 'cl-calc-btn': {
                    if (this._calcDom.chipLoad) {
                        const ipm = Math.abs(Number(this._calcDom.chipLoad.ipm.value));
                        const rpm = Math.abs(Number(this._calcDom.chipLoad.rpm.value));
                        const numFlutes = Math.abs(Number(this._calcDom.chipLoad.numFlutes.value));

                        this._calcDom.chipLoad.ipm.value = ipm ? ipm.toString() : '';
                        this._calcDom.chipLoad.rpm.value = rpm ? rpm.toString() : '';
                        this._calcDom.chipLoad.numFlutes.value = numFlutes ? numFlutes.toString() : '';

                        result = this.calcChipLoad(ipm, rpm, numFlutes);

                        this.displayResults(result, this._calcDom.chipLoad);
                    }
                    break;
                }
            }
        }
    }

    private displayResults(result: number | undefined, target: TCalcDom): void {
        if (result && result !== Number.POSITIVE_INFINITY) {
            // Precision is 2 decimals or 5 for Chip Load
            const precision = target === this._calcDom.chipLoad ? 5 : 2;

            if (target) {
                target.results.classList.remove('error');
                target.results.innerHTML = result.toFixed(precision);
            }
        } else {
            // Answer is NaN or Infinity
            if (target) {
                target.results.classList.add('error');
                target.results.innerHTML = 'Err';
            }
        }
    }

    private calcRPM(sfm: number, toolDia: number, units: Units): number | undefined {
        if (units === 'imperial') {
            return (sfm * 12) / (Math.PI * toolDia);
        } else {
            return (sfm * 1000) / (Math.PI * toolDia);
        }
    }

    private calcSFM(rpm: number, toolDia: number, units: Units): number | undefined {
        if (units === 'imperial') {
            // Calculate SFM for Imperial
            return (Math.PI * toolDia * rpm) / 12;
        } else {
            // Calculate SFM for Metric
            return (Math.PI * toolDia * rpm) / 1000;
        }
    }

    private calcFeedRate(rpm: number, numFlutes: number, feedPerTooth: number): number | undefined {
        return rpm * feedPerTooth * numFlutes;
    }

    private calcChipLoad(feedRate: number, rpm: number, numFlutes: number): number | undefined {
        return feedRate / rpm / numFlutes;
    }
}

new CalcApp();
