/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { GQuickPick } from './common';

interface State {
    title: string;
    step: number;
    totalSteps: number;
    start: number;
    increment: number;
}

const title = 'Line Number Options';

const defaults = {
    start: 10,
    increment: 10,
};

export class LineNumbersInput extends GQuickPick {
    private readonly _state;

    constructor() {
        // Multi-Step
        super(true);

        this._state = {} as Partial<State>;
    }

    async collect() {
        await this.run(() => this.enterStart());
        return this._state as State;
    }

    private async enterStart() {
        this._state.start = +(await this.showMultiInputBox({
            title,
            step: 1,
            totalSteps: 2,
            value: this._state.start?.toString() || defaults.start.toString(),
            prompt: 'Choose Start Number',
            validate: this.validate,
            shouldResume: this.shouldResume,
        }));

        return () => this.enterIncrement();
    }

    private async enterIncrement() {
        this._state.increment = +(await this.showMultiInputBox({
            title,
            step: 2,
            totalSteps: 2,
            value: this._state.increment?.toString() || defaults.increment.toString(),
            prompt: 'Choose Increment Number',
            validate: this.validate,
            shouldResume: this.shouldResume,
        }));
    }

    protected validate(_value: number | string): Promise<string | undefined> {
        if (typeof _value === 'string') {
            _value = +_value;
        }

        if (isNaN(_value)) {
            return Promise.resolve('Value is not a number');
        } else if (_value < 1) {
            return Promise.resolve('Number must be greater than zero.');
        } else {
            return Promise.resolve(undefined);
        }
    }
}
