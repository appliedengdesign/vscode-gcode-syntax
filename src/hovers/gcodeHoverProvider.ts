/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import {
    CancellationToken,
    Hover,
    HoverProvider,
    MarkdownString,
    Position,
    ProviderResult,
    TextDocument,
} from 'vscode';
import { Control } from '../control';

export class GCodeHoverProvider implements HoverProvider {
    provideHover(document: TextDocument, position: Position, _token: CancellationToken): ProviderResult<Hover> {
        const range = document.getWordRangeAtPosition(position);
        const text = document.getText(range);

        const def = this.lookup(text);
        if (def === undefined) {
            return;
        } else {
            return new Hover(def, range);
        }
    }

    private lookup(text: string): MarkdownString | undefined {
        const ref = Control.machineTypeController?.gReference;

        const code = ref?.get(text);

        if (code === undefined) {
            return;
        }

        return new MarkdownString(`**${text}**: `).appendMarkdown(code.shortDesc ?? '');
    }
}
