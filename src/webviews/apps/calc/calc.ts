/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { GWebviewApp } from '../shared/gWebviewApp';
import { WebviewMsg } from '../../webviewMsg.types';
import { calcBootstrap, ICalcDom, MachineType, MachineTypes, TCalcDom, Units } from './calc.types';

export class CalcApp extends GWebviewApp {
    private _calcDom: ICalcDom = {};
    private _clearBtns: NodeListOf<HTMLElement> | undefined;
    private _machineType: MachineType = MachineTypes.Mill;
    private _units: Units = Units.Default;

    constructor() {
        super('CalcApp');

        // Populate DOM
        this._populateDOM();

        // Register Button Events
        this._registerBtns();

        // Load Units & MachineType from Bootstrap
        if (this.bootstrap) {
            this._machineType = (this.bootstrap.payload as calcBootstrap).machineType;
            this._units = (this.bootstrap.payload as calcBootstrap).units;
            this._updateUnits();
        }
    }

    private _populateDOM(): void {
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

        // Populate Chipload Calculator
        this._calcDom.chipLoad = {
            btn: document.getElementById('cl-calc-btn') as HTMLElement,
            feedRate: document.getElementById('cl-ipm')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            rpm: document.getElementById('cl-rpm')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            numFlutes: document
                .getElementById('cl-num-flutes')
                ?.shadowRoot?.getElementById('control') as HTMLInputElement,
            results: document.getElementById('cl-results') as HTMLSpanElement,
        };

        // Populate MRR Calculator
        this._calcDom.mrr = {
            btn: document.getElementById('mrr-calc-btn') as HTMLElement,
            axialDepth: document.getElementById('mrr-ap')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            radialDepth: document.getElementById('mrr-ae')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            feedRate: document.getElementById('mrr-fr')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            results: document.getElementById('mrr-results') as HTMLSpanElement,
        };
    }

    protected onMsgReceived(e: MessageEvent<WebviewMsg>): void {
        const message = e.data;

        switch (message.type) {
            case 'changeUnits':
                this._units = message.payload as Units;
                this._updateUnits();
                this._clearBtns?.forEach(btn => {
                    btn.click();
                });

                break;

            default:
                return;
        }
    }

    private _updateUnits(): void {
        document.querySelectorAll<HTMLElement>('span.units').forEach(elem => {
            elem.innerHTML = `Units: ${this._units}`;
        });
    }

    private _registerBtns(): void {
        Object.keys(this._calcDom).forEach(key => {
            this._calcDom[key as keyof ICalcDom]?.btn.addEventListener('click', this._processEvent.bind(this), false);
        });

        this._clearBtns = document.querySelectorAll<HTMLElement>('span.clear-btn > vscode-button');

        if (this._clearBtns) {
            this._clearBtns.forEach(btn => {
                btn.addEventListener('click', this._clearFields.bind(this), false);
            });
        }
    }

    private _processEvent(e: MouseEvent): void {
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

                        result = this._calcRPM(sfm, toolDia, this._units);

                        this._displayResults(result, this._calcDom.rpm);
                    }
                    break;
                }

                case 'sfm-calc-btn': {
                    if (this._calcDom.sfm) {
                        const rpm = Math.abs(Number(this._calcDom.sfm.rpm.value));
                        const toolDia = Math.abs(Number(this._calcDom.sfm.toolDia.value));

                        this._calcDom.sfm.rpm.value = rpm ? rpm.toString() : '';
                        this._calcDom.sfm.toolDia.value = toolDia ? toolDia.toString() : '';

                        result = this._calcSFM(rpm, toolDia, this._units);

                        this._displayResults(result, this._calcDom.sfm);
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

                        result = this._calcFeedRate(rpm, numFlutes, chipLoad);

                        this._displayResults(result, this._calcDom.feedrate);
                    }
                    break;
                }

                case 'cl-calc-btn': {
                    if (this._calcDom.chipLoad) {
                        const feedRate = Math.abs(Number(this._calcDom.chipLoad.feedRate.value));
                        const rpm = Math.abs(Number(this._calcDom.chipLoad.rpm.value));
                        const numFlutes = Math.abs(Number(this._calcDom.chipLoad.numFlutes.value));

                        this._calcDom.chipLoad.feedRate.value = feedRate ? feedRate.toString() : '';
                        this._calcDom.chipLoad.rpm.value = rpm ? rpm.toString() : '';
                        this._calcDom.chipLoad.numFlutes.value = numFlutes ? numFlutes.toString() : '';

                        result = this._calcChipLoad(feedRate, rpm, numFlutes);

                        this._displayResults(result, this._calcDom.chipLoad);
                    }
                    break;
                }

                case 'mrr-calc-btn': {
                    if (this._calcDom.mrr) {
                        const axialDepth = Math.abs(Number(this._calcDom.mrr.axialDepth.value));
                        const radialDepth = Math.abs(Number(this._calcDom.mrr.radialDepth.value));
                        const feedRate = Math.abs(Number(this._calcDom.mrr.feedRate.value));

                        this._calcDom.mrr.axialDepth.value = axialDepth ? axialDepth.toString() : '';
                        this._calcDom.mrr.radialDepth.value = radialDepth ? radialDepth.toString() : '';
                        this._calcDom.mrr.feedRate.value = feedRate ? feedRate.toString() : '';

                        result = this._calcMRR(axialDepth, radialDepth, feedRate);

                        this._displayResults(result, this._calcDom.mrr);
                    }
                }
            }
        }
    }

    private _clearFields(e: MouseEvent): void {
        const target = e.target as HTMLButtonElement;

        if (target) {
            const targetView = target.id.split('-')[1];

            // Clear Input Fields
            document.querySelectorAll<HTMLElement>(`#view-${targetView} vscode-text-field`).forEach(input => {
                const element = input.shadowRoot?.getElementById('control') as HTMLInputElement;
                element.value = '';
            });

            // Clear Results Field
            document.querySelectorAll<HTMLElement>(`#view-${targetView} span.results`).forEach(span => {
                span.innerHTML = '';
            });
        }
    }

    private _displayResults(result: number | undefined, target: TCalcDom): void {
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

    private _calcRPM(sfm: number, toolDia: number, units: Units): number | undefined {
        if (units === Units.Inch || units === Units.Default) {
            return (sfm * 12) / (Math.PI * toolDia);
        } else {
            return (sfm * 1000) / (Math.PI * toolDia);
        }
    }

    private _calcSFM(rpm: number, toolDia: number, units: Units): number | undefined {
        if (units === Units.Inch || units === Units.Default) {
            // Calculate SFM for Imperial
            return (Math.PI * toolDia * rpm) / 12;
        } else {
            // Calculate SFM for Metric
            return (Math.PI * toolDia * rpm) / 1000;
        }
    }

    private _calcFeedRate(rpm: number, numFlutes: number, feedPerTooth: number): number | undefined {
        return rpm * feedPerTooth * numFlutes;
    }

    private _calcChipLoad(feedRate: number, rpm: number, numFlutes: number): number | undefined {
        return feedRate / rpm / numFlutes;
    }

    private _calcMRR(axialDepth: number, radialDepth: number, feedRate: number): number | undefined {
        return feedRate * radialDepth * axialDepth;
    }
}

new CalcApp();
