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
            this._updateMachineType();
        }
    }

    private _populateDOM(): void {
        // Populate RPM Calculator
        this._calcDom.rpm = {
            btn: document.getElementById('rpm-calc-btn') as HTMLElement,
            speed: document.getElementById('rpm-speed')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            toolDia: document.getElementById('rpm-tool-dia')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            results: document.getElementById('rpm-results') as HTMLSpanElement,
        };

        // Populate SFM Calculator
        this._calcDom.speed = {
            btn: document.getElementById('speed-calc-btn') as HTMLElement,
            rpm: document.getElementById('speed-rpm')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            toolDia: document
                .getElementById('speed-tool-dia')
                ?.shadowRoot?.getElementById('control') as HTMLInputElement,
            results: document.getElementById('speed-results') as HTMLSpanElement,
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
            feedRate: document.getElementById('cl-feedrate')?.shadowRoot?.getElementById('control') as HTMLInputElement,
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

        // Populate Finish Calculator
        this._calcDom.finish = {
            btn: document.getElementById('finish-btn') as HTMLElement,
            radius: document.getElementById('finish-radius')?.shadowRoot?.getElementById('control') as HTMLInputElement,
            feedRate: document
                .getElementById('finish-feedrate')
                ?.shadowRoot?.getElementById('control') as HTMLInputElement,
            results: document.getElementById('finish-results') as HTMLSpanElement,
        };
    }

    protected onMsgReceived(e: MessageEvent<WebviewMsg>): void {
        const message = e.data;

        switch (message.type) {
            case 'changeUnits':
                {
                    this._units = message.payload as Units;
                    this._updateUnits();
                    this._clearBtns?.forEach(btn => {
                        btn.click();
                    });
                }
                break;

            case 'changeMachineType':
                {
                    this._machineType = message.payload as MachineType;
                    this._updateMachineType();
                }
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

    private _updateMachineType(): void {
        // Clear Fields
        this._clearFields();

        switch (this._machineType) {
            case MachineTypes.Mill:
                {
                    // Focus Speeds Tab
                    const speedsTab = document.getElementById('tab-1') as HTMLElement;
                    if (speedsTab) {
                        speedsTab.click();
                    }

                    // Hide Surface Finish Calculator
                    const finishSection = document.getElementById('finish') as HTMLElement;
                    if (finishSection) {
                        finishSection.style.visibility = 'hidden';
                    }

                    const mrrTab = document.getElementById('tab-3') as HTMLElement;
                    if (mrrTab) {
                        mrrTab.innerHTML = 'MRR';
                    }

                    // Show Feeds Tab
                    const tab = document.getElementById('tab-2') as HTMLElement;
                    const tabView = document.getElementById('view-2') as HTMLElement;
                    if (tab && tabView) {
                        tab.style.display = '';
                        tabView.style.display = '';
                    }

                    // Update Diameter -> Tool Dia
                    const rpmDiaField = document.getElementById('rpm-tool-dia') as HTMLElement;
                    if (rpmDiaField) {
                        rpmDiaField.setAttribute('placeholder', 'Enter Tool Dia');
                        rpmDiaField.innerHTML = 'Diameter';
                    }

                    const speedDiaField = document.getElementById('speed-tool-dia') as HTMLElement;
                    if (speedDiaField) {
                        speedDiaField.setAttribute('placeholder', 'Enter Tool Dia');
                        speedDiaField.innerHTML = 'Diameter';
                    }

                    // Update MRR Calculator
                    const mrrDepth = document.getElementById('mrr-ap') as HTMLElement;
                    if (mrrDepth) {
                        mrrDepth.setAttribute('placeholder', 'Axial DoC');
                        mrrDepth.innerHTML = 'A<sub>p</sub> - Axial DoC';
                    }

                    const mrrSpeed = document.getElementById('mrr-ae') as HTMLElement;
                    if (mrrSpeed) {
                        mrrSpeed.setAttribute('placeholder', 'Radial DoC');
                        mrrSpeed.innerHTML = 'A<sub>e</sub> - Radial DoC';
                    }
                }
                break;

            case MachineTypes.Lathe:
            case MachineTypes.Swiss:
                {
                    // Focus Speeds Tab
                    const speedsTab = document.getElementById('tab-1') as HTMLElement;
                    if (speedsTab) {
                        speedsTab.click();
                    }

                    // Hide Feeds Tab
                    const tab = document.getElementById('tab-2') as HTMLElement;
                    const tabView = document.getElementById('view-2') as HTMLElement;
                    if (tab && tabView) {
                        tab.style.display = 'none';
                        tabView.style.display = 'none';
                    }

                    // Update Tool Dia -> Diameter
                    const rpmDiaField = document.getElementById('rpm-tool-dia') as HTMLElement;
                    if (rpmDiaField) {
                        rpmDiaField.setAttribute('placeholder', 'Enter Dia');
                        rpmDiaField.innerHTML = 'Diameter';
                    }

                    const speedDiaField = document.getElementById('speed-tool-dia') as HTMLElement;
                    if (speedDiaField) {
                        speedDiaField.setAttribute('placeholder', 'Enter Dia');
                        speedDiaField.innerHTML = 'Diameter';
                    }

                    // Update MRR Calculator
                    const mrrDepth = document.getElementById('mrr-ap') as HTMLElement;
                    if (mrrDepth) {
                        mrrDepth.setAttribute('placeholder', 'Depth of Cut');
                        mrrDepth.innerHTML = 'Depth of Cut';
                    }

                    const mrrSpeed = document.getElementById('mrr-ae') as HTMLElement;
                    if (mrrSpeed) {
                        mrrSpeed.setAttribute('placeholder', `Enter ${this._units === Units.MM ? 'SMM' : 'SFM'}`);
                        mrrSpeed.innerHTML = 'Cutting Speed';
                    }

                    // Show Surface Finish Calculator
                    const finishSection = document.getElementById('finish') as HTMLElement;
                    if (finishSection) {
                        finishSection.style.visibility = '';
                    }

                    const mrrTab = document.getElementById('tab-3') as HTMLElement;
                    if (mrrTab) {
                        mrrTab.innerHTML = 'MRR / SF';
                    }
                }
                break;

            default:
                return;
        }
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
                case 'rpm-calc-btn':
                    {
                        if (this._calcDom.rpm) {
                            const sfm = Math.abs(Number(this._calcDom.rpm.speed.value));
                            const toolDia = Math.abs(Number(this._calcDom.rpm.toolDia.value));

                            this._calcDom.rpm.speed.value = sfm ? sfm.toString() : '';
                            this._calcDom.rpm.toolDia.value = toolDia ? sfm.toString() : '';

                            result = this._calcRPM(sfm, toolDia);

                            this._displayResults(result, this._calcDom.rpm);
                        }
                    }
                    break;

                case 'speed-calc-btn':
                    {
                        if (this._calcDom.speed) {
                            const rpm = Math.abs(Number(this._calcDom.speed.rpm.value));
                            const toolDia = Math.abs(Number(this._calcDom.speed.toolDia.value));

                            this._calcDom.speed.rpm.value = rpm ? rpm.toString() : '';
                            this._calcDom.speed.toolDia.value = toolDia ? toolDia.toString() : '';

                            result = this._calcSFM(rpm, toolDia);

                            this._displayResults(result, this._calcDom.speed);
                        }
                    }
                    break;

                case 'fr-calc-btn':
                    {
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
                    }
                    break;

                case 'cl-calc-btn':
                    {
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
                    }
                    break;

                case 'mrr-calc-btn':
                    {
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
                    break;

                case 'finish-btn':
                    {
                        if (this._calcDom.finish) {
                            const radius = Math.abs(Number(this._calcDom.finish.radius.value));
                            const feedRate = Math.abs(Number(this._calcDom.finish.feedRate.value));

                            this._calcDom.finish.radius.value = radius ? radius.toString() : '';
                            this._calcDom.finish.feedRate.value = feedRate ? feedRate.toString() : '';

                            result = this._calcSurfaceFinish(radius, feedRate);

                            this._displayResults(result, this._calcDom.finish);
                        }
                    }
                    break;
            }
        }
    }

    private _clearFields(e?: MouseEvent): void {
        if (e) {
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
        } else {
            // Clear All Fields
            document.querySelectorAll<HTMLElement>('vscode-text-field').forEach(input => {
                const element = input.shadowRoot?.getElementById('control') as HTMLInputElement;
                element.value = '';
            });

            document.querySelectorAll<HTMLElement>('span.results').forEach(span => {
                span.innerHTML = '';
            });
        }
    }

    private _displayResults(result: number | undefined, target: TCalcDom): void {
        if (result && result !== Number.POSITIVE_INFINITY) {
            if (target) {
                target.results.classList.remove('error');

                // Set Precision to 2 for > 1 or 4 or < 1
                const precision = target !== this._calcDom.mrr && result < 1 ? 4 : 2;
                let units = '';

                // Assign units
                switch (target) {
                    case this._calcDom.rpm:
                        {
                            units = '[RPM]';
                        }
                        break;

                    case this._calcDom.speed:
                        {
                            if (this._units === Units.MM) {
                                units = '[m/min]';
                            } else {
                                units = '[SFM]';
                            }
                        }
                        break;

                    case this._calcDom.feedrate:
                        {
                            if (this._units === Units.MM) {
                                units = '[mm/min]';
                            } else {
                                units = '[in/min]';
                            }
                        }
                        break;

                    case this._calcDom.chipLoad:
                        {
                            if (this._units === Units.MM) {
                                units = '[mm]';
                            } else {
                                units = '[in]';
                            }
                        }
                        break;

                    case this._calcDom.mrr:
                        {
                            if (this._units === Units.MM) {
                                units = '[cm<sup>3</sup>/min]';
                            } else {
                                units = '[mm<sup>3</sup>/min]';
                            }
                        }
                        break;

                    case this._calcDom.finish:
                        {
                            if (this._units === Units.MM) {
                                units = '[μ]';
                            } else {
                                units = '[μ in]';
                            }
                        }
                        break;
                }
                target.results.innerHTML = `${result.toFixed(precision)} <sub>${units}</sub>`;
            }
        } else {
            // Answer is NaN or Infinity
            if (target) {
                target.results.classList.add('error');
                target.results.innerHTML = 'Err';
            }
        }
    }

    private _calcRPM(sfm: number, toolDia: number): number | undefined {
        const rpm = sfm / (Math.PI * toolDia);
        if (this._units === Units.MM) {
            return rpm * 1000;
        } else {
            return rpm * 12;
        }
    }

    private _calcSFM(rpm: number, toolDia: number): number | undefined {
        const sfm = Math.PI * toolDia * rpm;
        if (this._units === Units.MM) {
            return sfm / 1000;
        } else {
            return sfm / 12;
        }
    }

    private _calcFeedRate(rpm: number, numFlutes: number, feedPerTooth: number): number | undefined {
        return rpm * feedPerTooth * numFlutes;
    }

    private _calcChipLoad(feedRate: number, rpm: number, numFlutes: number): number | undefined {
        return feedRate / rpm / numFlutes;
    }

    private _calcMRR(axialDepth: number, radialDepth: number, feedRate: number): number | undefined {
        const mrr = feedRate * radialDepth * axialDepth;

        if (this._machineType === MachineTypes.Lathe || this._machineType === MachineTypes.Swiss) {
            if (this._units === Units.MM) {
                return mrr;
            } else {
                return mrr * 12;
            }
        } else {
            return mrr;
        }
    }

    private _calcSurfaceFinish(radius: number, feedRate: number): number | undefined {
        const finish = Math.pow(feedRate, 2) / radius;

        if (this._units === Units.MM) {
            return finish * 46;
        } else {
            return finish * 31675;
        }
    }
}

new CalcApp();
