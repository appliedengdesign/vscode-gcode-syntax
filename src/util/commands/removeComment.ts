/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { Range, window } from 'vscode';
import { constants, GCommands } from '../constants';
import { GCommand } from './base';

export class RemoveComment extends GCommand {
    constructor() {
        super(GCommands.RemoveComment);
    }

    execute() {
        const editor = window.activeTextEditor;

        if (editor && editor.document.uri.scheme === 'file' && editor.document.languageId === constants.langId) {
            const select = new Range(editor.selection.start, editor.selection.end);

            let text = editor.document.getText(select);

            // Remove () in the selection
            const re1 = /\(|\)/g;

            text = text.replace(re1, '');

            void editor.edit(editBuilder => {
                editBuilder.replace(select, text);
            });
        }
    }
}
