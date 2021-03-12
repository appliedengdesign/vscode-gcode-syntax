/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { CancellationToken, Hover, HoverProvider, MarkdownString, Position, TextDocument } from 'vscode';

export class GCodeHoverProvider implements HoverProvider {
    async provideHover(document: TextDocument, position: Position, _token: CancellationToken): Promise<Hover> {
        const range = document.getWordRangeAtPosition(position);
        const text = document.getText(range);

        return new Hover();
    }

    private async gcodeLookup(text: string): MarkdownString {}
}
