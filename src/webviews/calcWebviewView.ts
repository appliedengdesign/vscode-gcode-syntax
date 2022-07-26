/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { Uri, Webview } from 'vscode';
import { Control } from '../control';
import { GWebviewView } from './gWebviewView';

const CalcWebviewInfo = {
    ViewId: 'gcode.webviews.calc',
    Title: 'Milling / Turning Calculators',
};

export class CalcWebviewView extends GWebviewView {
    constructor() {
        super(CalcWebviewInfo.ViewId, CalcWebviewInfo.Title);
    }

    async getHtml(webview: Webview): Promise<string> {
        // CSS styles
        const stylesReset = webview.asWebviewUri(
            Uri.joinPath(Control.context.extensionUri, 'resources', 'webviews', 'css', 'reset.css'),
        );

        const stylesMain = webview.asWebviewUri(
            Uri.joinPath(Control.context.extensionUri, 'resources', 'webviews', 'css', 'vscode.css'),
        );

        const nonce = this.getNonce();

        return Promise.resolve(`<!DOCTYPE html>
                <html lang="en">
                <head>
                        <meta charset="UTF-8">
                        
                        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; 
                        style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; 
                        script-src 'nonce-${nonce}';">
                        
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        
                        <link href="${String(stylesReset)}" rel="stylesheet">
                        <link href="${String(stylesMain)}" rel="stylesheet">
                        
                        <title>Calc</title>
                </head>
                <body>Calculators</body>
                </html>`);
    }
}
