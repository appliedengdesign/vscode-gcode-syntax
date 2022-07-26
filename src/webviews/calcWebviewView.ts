/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { TextDecoder } from 'util';
import { Uri, Webview, workspace } from 'vscode';
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

        // vscode-webview-ui-toolkit
        const toolkitUri = webview.asWebviewUri(
            Uri.joinPath(
                Control.context.extensionUri,
                'node_modules',
                '@vscode',
                'webview-ui-toolkit',
                'dist',
                'toolkit.js',
            ),
        );

        const nonce = this.getNonce();

        // const body = new TextDecoder('utf8').decode(await workspace.fs.readFile())

        return Promise.resolve(`<!DOCTYPE html>
                <html lang="en">
                <head>
                        <meta charset="UTF-8">
                        
                        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; 
                        style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} https:; 
                        script-src 'nonce-${nonce}';">
                        
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">

                        <script nonce="${nonce}" type="module" src="${String(toolkitUri)}"></script>
                        
                        <link href="${String(stylesReset)}" rel="stylesheet">
                        <link href="${String(stylesMain)}" rel="stylesheet">
                        
                        <title>Calc</title>
                </head>
                <body>
                    <vscode-panels>
                        <vscode-panel-tab id="tab-1">MILLING</vscode-panel-tab>
                        <vscode-panel-tab id="tab-2">TURNING</vscode-panel-tab>

                        <vscode-panel-view id="view-1">
                            <vscode-text-field id="SFM" placeholder="SFM"</vscode-text-field>
                            <vscode-button id="rpm-calc">Calculate></vscode-button>

                            <section id="rpm-results"></section>
                        </vscode-panel-view>
                        <vscode-panel-view id="view-2"></vscode-panel-view>
                    </vscode-panels>
                </body>
                </html>`);
    }
}
