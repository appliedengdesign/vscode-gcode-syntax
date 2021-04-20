/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { Range, window } from 'vscode';
import { constants } from '../constants';
import { GCommand, UtilCommands } from './common';

export class AddComment extends GCommand {
    constructor() {
        super(UtilCommands.AddComment);
    }

    execute() {
        const editor = window.activeTextEditor;
        let replace = '';

        if (editor && editor.document.uri.scheme === 'file' && editor.document.languageId === constants.langId) {
            const select = new Range(editor.selection.start, editor.selection.end);
            let text = editor.document.getText(select);

            // Remove any () in the selection
            const re1 = /\(|\)/;

            text = text.replace(re1, '');

            const lines = text.split(/\r?\n|\r/g) || [];

            for (let i = 0; i < lines.length; ++i) {
                lines[i] = lines[i].replace(/\r?\n|\r/g, '');
                replace += `(${lines[i]})${i + 1 === lines.length ? '' : '\n'}`;
            }

            void editor.edit(editBuilder => {
                editBuilder.replace(select, replace);
            });
        }
    }
}
