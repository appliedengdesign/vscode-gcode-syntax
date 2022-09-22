/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { ProgressLocation, Range, TextEditor, TextEditorEdit, window } from 'vscode';
import { configuration } from './configuration/config';
import { defaults } from './configuration/defaults';
import { constants } from './constants';
import { Messages } from './messages';

export enum LineNumberFrequency {
    EveryLine = 'Every Line',
    AtToolChanges = 'At Tool Changes',
}

export type LineNumbererOptions = {
    addSpaceAfter: boolean;
    defaultStart: number;
    defaultIncrement: number;
    enableQuickPick: boolean;
    frequency: LineNumberFrequency;
    ignoreBlank: boolean;
    ignoreComments: boolean;
    ignoreExtra: Array<string>;
    ignoreProgramNumbers: boolean;
    matchLineNumber: boolean;
    showProgress: boolean;
};

export class LineNumberer {
    private _editor: TextEditor | undefined;
    private _opts: LineNumbererOptions;

    constructor() {
        this._editor = window.activeTextEditor;

        this._opts = configuration.getParam('lineNumberer') ?? defaults.lineNumberer;
    }

    async addNumbers(start?: number, increment?: number): Promise<boolean> {
        await window
            .withProgress(
                {
                    location: ProgressLocation.Window,
                    title: 'Adding Line Numbers',
                    cancellable: false,
                },
                async progress => {
                    progress.report({ increment: 0 });
                    if (
                        this._editor &&
                        this._editor.document &&
                        this._editor.document.uri.scheme === 'file' &&
                        this._editor.document.languageId === constants.langId
                    ) {
                        await this._editor
                            .edit(
                                this._addNumbers(
                                    start ??
                                        configuration.getParam('lineNumberer.defaultStart') ??
                                        defaults.lineNumberer.defaultStart,
                                    increment ??
                                        configuration.getParam('lineNumberer.defaultIncrement') ??
                                        defaults.lineNumberer.defaultIncrement,
                                ),
                            )
                            .then(
                                done => {
                                    progress.report({ increment: 100, message: 'Done' });

                                    return done;
                                },
                                reason => {
                                    void Messages.showErrorMessage(`Error Adding Line Numbers\n${<string>reason}`);
                                },
                            );
                    } else {
                        void Messages.showErrorMessage('Editor does not contain G-Code');
                        return false;
                    }

                    return;
                },
            )
            .then(
                done => {
                    return done;
                },
                reason => {
                    void Messages.showErrorMessage(reason);
                    return false;
                },
            );

        return false;
    }

    private _addNumbers(start: number, increment: number): (editBuilder: TextEditorEdit) => void {
        return editBuilder => {
            if (
                this._editor &&
                this._editor.document &&
                this._editor.document.uri.scheme === 'file' &&
                this._editor.document.languageId === constants.langId
            ) {
                let curNum = start;

                for (let i = 0; i < this._editor.document.lineCount; i++) {
                    const line = this._editor.document.lineAt(i);

                    if (line.text) {
                        // Test for Blank Line
                        if (line.text.length === 0 && this._opts.ignoreBlank) {
                            continue;
                        }

                        // Test For Comments
                        if (/^\s*\(.*\)\s*$|^\s*;.*/.test(line.text) && this._opts.ignoreComments) {
                            continue;
                        }

                        // Test for Program Numbers
                        if (/(^[oO])(\d+)/.test(line.text) && this._opts.ignoreProgramNumbers) {
                            continue;
                        }

                        // Test For Extra
                        if (this._opts.ignoreExtra.some(rx => new RegExp(rx).test(line.text))) {
                            continue;
                        }

                        if (this._opts.frequency === LineNumberFrequency.AtToolChanges && !/(M0?6)/.test(line.text)) {
                            continue;
                        }

                        editBuilder.replace(
                            new Range(i, 0, i, line.text.length),
                            this._opts.matchLineNumber
                                ? `N${i * increment + start}${this._opts.addSpaceAfter ? ' ' : ''}${line.text.replace(
                                      /^N\d*\s*/i,
                                      '',
                                  )}`
                                : `N${curNum}${this._opts.addSpaceAfter ? ' ' : ''}${line.text.replace(
                                      /^N\d*\s*/i,
                                      '',
                                  )}`,
                        );

                        curNum += increment;
                    }
                }
            }
        };
    }

    async removeNumbers(): Promise<boolean> {
        await window
            .withProgress(
                {
                    location: ProgressLocation.Window,
                    title: 'Removing Line Numbers',
                    cancellable: false,
                },
                async progress => {
                    progress.report({ increment: 0 });
                    if (
                        this._editor &&
                        this._editor.document &&
                        this._editor.document.uri.scheme === 'file' &&
                        this._editor.document.languageId === constants.langId
                    ) {
                        await this._editor.edit(this._removeNumbers()).then(
                            done => {
                                progress.report({ increment: 100, message: 'Done' });

                                return done;
                            },
                            reason => {
                                void Messages.showErrorMessage(`Error Removing Line Numbers\n${<string>reason}`);
                            },
                        );
                    } else {
                        void Messages.showErrorMessage('Editor does not contain G-Code');
                        return false;
                    }

                    return;
                },
            )
            .then(
                done => {
                    return done;
                },
                reason => {
                    void Messages.showErrorMessage(reason);
                    return false;
                },
            );
        return false;
    }

    private _removeNumbers(): (editBuilder: TextEditorEdit) => void {
        return editBuilder => {
            if (
                this._editor &&
                this._editor.document &&
                this._editor.document.uri.scheme === 'file' &&
                this._editor.document.languageId === constants.langId
            ) {
                for (let i = 0; i < this._editor.document.lineCount; i++) {
                    const line = this._editor.document.lineAt(i);

                    if (line.text) {
                        const rem = /^N\d*\s*/i;

                        if (rem.test(line.text)) {
                            const newLine = line.text.replace(rem, '');
                            editBuilder.replace(new Range(i, 0, i, line.text.length), newLine);
                        }
                    }
                }
            }
        };
    }
}
