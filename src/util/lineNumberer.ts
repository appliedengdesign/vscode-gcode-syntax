/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { Progress, ProgressLocation, Range, TextEditor, window } from 'vscode';

export enum LineNumberFrequency {
    EveryLine,
    AtToolChanges,
}

type LineNumbererOptions = {
    addSpaceAfter?: boolean;
    frequency?: LineNumberFrequency;
    ignoreComments?: boolean;
    ignoreBlank?: boolean;
    ignoreProgramNumbers?: boolean;
};

type ProgressInfo = {
    message?: string | undefined;
    increment?: number | undefined;
};

export class LineNumberer {
    private _editor: TextEditor | undefined;
    private _beforeText: string = '';

    constructor() {
        this._editor = window.activeTextEditor;
    }

    async addNumbers(
        start: number,
        increment: number,
        showProgress: boolean,
        options?: LineNumbererOptions,
    ): Promise<boolean> {
        if (this._editor && this._editor.document) {
            this._beforeText = this._editor.document.getText();
        }
        // Remove any numbers first
        const newtext = this._removeNumbers(this._beforeText);
        if (showProgress) {
            await window.withProgress(
                {
                    location: ProgressLocation.Notification,
                    title: 'Adding Line Numbers',
                    cancellable: true,
                },
                (progress, token) => {
                    token.onCancellationRequested(() => {
                        return this._updateTextEditor(this._beforeText);
                    });

                    progress.report({ increment: 0, message: 'Adding Line Numbers...' });
                    return this._addNumbers(newtext, start, increment, progress, options).then(replace => {
                        progress.report({ increment: 100, message: 'Updating Text.' });
                        return Promise.resolve(this._updateTextEditor(replace));
                    });
                },
            );
        } else {
            return this._addNumbers(newtext, start, increment, undefined, options).then(replace => {
                return Promise.resolve(this._updateTextEditor(replace));
            });
        }

        return false;
    }

    private async _addNumbers(
        text: string,
        start: number,
        increment: number,
        progress?: Progress<ProgressInfo>,
        options?: LineNumbererOptions,
    ): Promise<string> {
        let replace = '';
        let curNum = start;
        const space = options?.addSpaceAfter ?? true ? ' ' : '';
        const lines = text.match(/.*(?:\r\n|\r|\n)/g) || [];

        for (let i = 0; i < lines.length; ++i) {
            lines[i] = lines[i].replace(/\r?\n|\r/g, '');
            const line = lines[i].trim();

            if ((options?.frequency ?? LineNumberFrequency.EveryLine) === LineNumberFrequency.EveryLine) {
                if (line.length === 0) {
                    if (options?.ignoreBlank ?? true) {
                        replace += `${line}${i + 1 === lines.length ? '' : '\n'}`;
                        if (progress) {
                            progress.report({ increment: Math.floor(i / lines.length) });
                        }
                        continue;
                    } else {
                        replace += `N${curNum}${space}`;
                        curNum += increment;
                        if (progress) {
                            progress.report({ increment: Math.floor(i / lines.length) });
                        }
                        continue;
                    }
                }

                const re = /\(|\)/;
                if (re.test(line)) {
                    if (options?.ignoreComments ?? true) {
                        replace += `${line}${i + 1 === lines.length ? '' : '\n'}`;
                        if (progress) {
                            progress.report({ increment: Math.floor(i / lines.length) });
                        }
                        continue;
                    } else {
                        replace += `N${curNum}${space}${line}${i + 1 === lines.length ? '' : '\n'}`;
                        curNum += increment;
                        if (progress) {
                            progress.report({ increment: Math.floor(i / lines.length) });
                        }
                        continue;
                    }
                }

                const re1 = /(^[oO])(\d+)/;
                if (re1.test(line)) {
                    if (options?.ignoreProgramNumbers ?? true) {
                        replace += `${line}${i + 1 === lines.length ? '' : '\n'}`;
                        if (progress) {
                            progress.report({ increment: Math.floor(i / lines.length) });
                        }
                        continue;
                    } else {
                        replace += `N${curNum}${space}${line}${i + 1 === lines.length ? '' : '\n'}`;
                        curNum += increment;
                        if (progress) {
                            progress.report({ increment: Math.floor(i / lines.length) });
                        }
                        continue;
                    }
                }

                replace += `N${curNum}${space}${line}${i + 1 === lines.length ? '' : '\n'}`;
                curNum += increment;
                if (progress) {
                    progress.report({ increment: Math.floor(i / lines.length) });
                }
            } else {
                const re = /(M0?6)/;

                if (re.test(line)) {
                    replace += `N${curNum}${space}${line}${i + 1 === lines.length ? '' : '\n'}`;
                    curNum += increment;
                    if (progress) {
                        progress.report({ increment: Math.floor(i / lines.length) });
                    }
                    continue;
                } else {
                    replace += `${line}${i + 1 === lines.length ? '' : '\n'}`;
                    curNum += increment;
                    if (progress) {
                        progress.report({ increment: Math.floor(i / lines.length) });
                    }
                    continue;
                }
            }
        }

        return Promise.resolve(replace);
    }

    async removeNumbers(showProgress: boolean = false): Promise<boolean> {
        if (this._editor && this._editor.document) {
            this._beforeText = this._editor.document.getText();
        }
        if (showProgress) {
            await window.withProgress(
                {
                    location: ProgressLocation.Notification,
                    title: 'Removing Line Numbers',
                    cancellable: true,
                },
                (progress, token) => {
                    token.onCancellationRequested(() => {
                        return this._updateTextEditor(this._beforeText);
                    });

                    progress.report({ increment: 0, message: 'Removing Line Numbers...' });

                    const replace = this._removeNumbers(this._beforeText);
                    progress.report({ increment: 100, message: 'Updating Text.' });

                    return this._updateTextEditor(replace);
                },
            );
        } else {
            const replace = this._removeNumbers(this._beforeText);
            return this._updateTextEditor(replace);
        }

        return false;
    }

    private _removeNumbers(replace: string): string {
        return replace.replace(new RegExp(/(^[nN])(\d+)/gim), '');
    }

    private async _updateTextEditor(text: string): Promise<boolean> {
        const len = this._beforeText.length;

        if (this._editor && this._editor.document) {
            return Promise.resolve(
                this._editor.edit(editBuilder => {
                    if (this._editor && this._editor.document) {
                        editBuilder.replace(
                            new Range(this._editor.document.positionAt(0), this._editor.document.positionAt(len - 1)),
                            text,
                        );

                        this._beforeText = '';
                    }
                }),
            );
        } else {
            this._beforeText = '';
            return false;
        }
    }
}
