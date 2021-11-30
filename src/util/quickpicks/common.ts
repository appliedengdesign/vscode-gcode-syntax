/* eslint-disable max-classes-per-file */
/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import {
    Disposable,
    InputBoxOptions,
    QuickInput,
    QuickInputButton,
    QuickInputButtons,
    QuickPickItem,
    QuickPickOptions,
    window,
} from 'vscode';

type InputStep = (input: GQuickPick) => Thenable<InputStep | void>;

interface QuickPickParameters<T extends QuickPickItem> {
    title: string;
    step: number;
    totalSteps: number;
    items: T[];
    activeItem?: T;
    placeholder: string;
    buttons?: QuickInputButton[];
    shouldResume: () => Thenable<boolean>;
}

interface InputBoxParameters {
    title: string;
    step: number;
    totalSteps: number;
    value: string;
    prompt: string;
    validate: (value: string) => Promise<string | undefined>;
    buttons?: QuickInputButton[];
    shouldResume: () => Thenable<boolean>;
}

class InputFlowAction {
    static back = new InputFlowAction();
    static cancel = new InputFlowAction();
    static resume = new InputFlowAction();
}

export abstract class GQuickPick {
    protected _current?: QuickInput;
    protected _steps: InputStep[] = [];

    constructor(private readonly isMulti: boolean) {}

    protected async run(start: InputStep) {
        return await this.stepThrough(start);
    }

    private async stepThrough(start: InputStep) {
        let step: InputStep | void = start;

        while (step) {
            this._steps.push(step);
            if (this._current) {
                this._current.enabled = false;
                this._current.busy = true;
            }

            try {
                step = await step(this);
            } catch (err) {
                if (err === InputFlowAction.back) {
                    this._steps.pop();
                    step = this._steps.pop();
                } else if (err === InputFlowAction.resume) {
                    step = this._steps.pop();
                } else if (err === InputFlowAction.cancel) {
                    step = undefined;
                } else {
                    throw err;
                }
            }

            if (this._current) {
                this._current.dispose();
            }
        }
    }

    protected validate(_value: number | string): Promise<string | undefined> {
        return Promise.resolve(undefined);
    }

    protected shouldResume() {
        return Promise.reject(false);
    }

    protected async showQuickPick<T extends QuickPickItem>(items: T[], options?: QuickPickOptions) {
        const disposables: Disposable[] = [];

        try {
            return await new Promise<T>((resove, reject) => {
                const input = window.createQuickPick<T>();

                if (options) {
                    input.title = options.title ?? '';
                    input.canSelectMany = options.canPickMany ?? false;
                    input.placeholder = options.placeHolder ?? '';
                    input.matchOnDescription = options.matchOnDescription ?? false;
                    input.matchOnDetail = options.matchOnDetail ?? false;
                }

                input.items = items;

                disposables.push(
                    input.onDidHide(() => {
                        () => {
                            reject(InputFlowAction.cancel);
                        };
                    }),

                    input.onDidChangeSelection(items => resove(items[0])),
                );

                if (this._current) {
                    this._current.dispose();
                }
                this._current = input;
                this._current.show();
            });
        } finally {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            disposables.forEach(d => d.dispose());
        }
    }

    protected async showInputBox(options?: InputBoxOptions) {
        const disposables: Disposable[] = [];

        try {
            return await new Promise((resolve, reject) => {
                const input = window.createInputBox();

                if (options) {
                    input.title = options.title ?? '';
                    input.ignoreFocusOut = options.ignoreFocusOut ?? false;
                    input.prompt = options.prompt ?? '';
                    input.value = options.value ?? '';
                    input.placeholder = options.placeHolder ?? '';
                    input.password = options.password ?? false;
                }

                let validating = this.validate('');

                disposables.push(
                    input.onDidAccept(async () => {
                        const value = input.value;
                        input.enabled = false;
                        input.busy = true;

                        if (!(await this.validate(value))) {
                            resolve(value);
                        }
                        input.enabled = true;
                        input.busy = false;
                    }),
                    input.onDidHide(() => {
                        reject(InputFlowAction.cancel);
                    }),
                    input.onDidChangeValue(async text => {
                        const current = this.validate(text);
                        validating = current;

                        const validationMessage = await current;
                        if (current === validating) {
                            input.validationMessage = validationMessage;
                        }
                    }),
                );

                if (this._current) {
                    this._current.dispose();
                }
                this._current = input;
                this._current.show();
            });
        } finally {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            disposables.forEach(d => d.dispose());
        }
    }

    protected async showMultiQuickPick<T extends QuickPickItem, P extends QuickPickParameters<T>>({
        title,
        step,
        totalSteps,
        items,
        activeItem,
        placeholder,
        buttons,
        shouldResume,
    }: P) {
        const disposables: Disposable[] = [];

        try {
            return await new Promise<T | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
                const input = window.createQuickPick<T>();

                input.title = title;
                input.step = step;
                input.totalSteps = totalSteps;
                input.placeholder = placeholder;
                input.items = items;

                if (activeItem) {
                    input.activeItems = [activeItem];
                }

                input.buttons = [...(this._steps.length > 1 ? [QuickInputButtons.Back] : []), ...(buttons || [])];

                disposables.push(
                    input.onDidTriggerButton(item => {
                        if (item === QuickInputButtons.Back) {
                            reject(InputFlowAction.back);
                        } else {
                            resolve(<any>item);
                        }
                    }),
                    input.onDidChangeSelection(items => resolve(items[0])),
                    input.onDidHide(() => {
                        (async () => {
                            reject(
                                shouldResume && (await shouldResume())
                                    ? InputFlowAction.resume
                                    : InputFlowAction.cancel,
                            );
                        })().catch(reject);
                    }),
                );

                if ((this._current = input)) {
                    this._current.dispose();
                }

                this._current = input;
                this._current.show();
            });
        } finally {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            disposables.forEach(d => d.dispose());
        }
    }

    protected async showMultiInputBox<P extends InputBoxParameters>({
        title,
        step,
        totalSteps,
        value,
        prompt,
        validate,
        buttons,
        shouldResume,
    }: P) {
        const disposables: Disposable[] = [];

        try {
            return await new Promise<string | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
                const input = window.createInputBox();

                input.title = title;
                input.step = step;
                input.totalSteps = totalSteps;
                input.value = value || '';
                input.prompt = prompt;
                input.buttons = [...(this._steps.length > 1 ? [QuickInputButtons.Back] : []), ...(buttons || [])];

                let validating = validate('');

                disposables.push(
                    input.onDidTriggerButton(item => {
                        if (item === QuickInputButtons.Back) {
                            reject(InputFlowAction.back);
                        } else {
                            resolve(<any>item);
                        }
                    }),
                    input.onDidAccept(async () => {
                        const value = input.value;
                        input.enabled = false;
                        input.busy = true;

                        if (!(await validate(value))) {
                            resolve(value);
                        }

                        input.enabled = true;
                        input.busy = false;
                    }),
                    input.onDidChangeValue(async text => {
                        const current = validate(text);
                        validating = current;

                        const validationMessage = await current;

                        if (current === validating) {
                            input.validationMessage = validationMessage;
                        }
                    }),
                    input.onDidHide(() => {
                        (async () => {
                            reject(
                                shouldResume && (await shouldResume())
                                    ? InputFlowAction.resume
                                    : InputFlowAction.cancel,
                            );
                        })().catch(reject);
                    }),
                );

                if (this._current) {
                    this._current.dispose();
                }

                this._current = input;
                this._current.show();
            });
        } finally {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            disposables.forEach(d => d.dispose());
        }
    }
}
