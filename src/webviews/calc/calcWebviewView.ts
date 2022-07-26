/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { commands, ConfigurationChangeEvent, Disposable, Uri, Webview } from 'vscode';
import { Control } from '../../control';
import { configuration } from '../../util/configuration/config';
import { defaults } from '../../util/configuration/defaults';
import { Contexts, WebviewCommands, Webviews, WebviewTitles } from '../../util/constants';
import { GWebviewView } from '../gWebviewView';

export class CalcWebviewView extends GWebviewView {
    constructor() {
        super(Webviews.CalcWebviewView, WebviewTitles.CalcWebviewView);

        if ((this._enabled = configuration.getParam(`${this.id.slice(6)}.enabled`) ?? defaults.webviews.calc.enabled)) {
            void Control.setContext(Contexts.CalcWebviewViewEnabled, true);
        }

        this._disposables.push(configuration.onDidChange(this.onConfigurationChanged, this));
    }

    dispose() {
        super.dispose();
    }

    private onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, `${this.id.slice(6)}.enabled`)) {
            if (this._enabled) {
                // Disable
                void Control.setContext(Contexts.CalcWebviewViewEnabled, false);
            } else {
                // Enable
                void Control.setContext(Contexts.CalcWebviewViewEnabled, true);
            }

            // void this.refresh();

            this._enabled = configuration.getParam(`${this.id.slice(6)}.enabled`) ?? defaults.webviews.calc.enabled;
        }
    }

    protected registerCommands(): Disposable[] {
        return [
            commands.registerCommand(
                WebviewCommands.ShowCalcWebview,
                () => {
                    void this.show();
                },
                this,
            ),
        ];
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
