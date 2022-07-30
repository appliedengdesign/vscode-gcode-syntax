/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { TextDecoder } from 'util';
import { commands, ConfigurationChangeEvent, Disposable, Uri, Webview, workspace } from 'vscode';
import { Control } from '../../control';
import { configuration } from '../../util/configuration/config';
import { defaults } from '../../util/configuration/defaults';
import { Contexts, WebviewCommands, Webviews, WebviewTitles } from '../../util/constants';
import { GWebviewView } from '../gWebviewView';
import { getNonce } from '../helpers';

export class CalcWebviewView extends GWebviewView {
    private _shortId: string;

    constructor() {
        super(Webviews.CalcWebviewView, WebviewTitles.CalcWebviewView);

        this._shortId = this.id.split('.').pop() ?? '';

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
        const webRootUri = Uri.joinPath(Control.context.extensionUri, 'dist', 'webviews');
        const uri = Uri.joinPath(webRootUri, this._shortId, `${this._shortId}.html`);
        const content = new TextDecoder('utf8').decode(await workspace.fs.readFile(uri));

        const cspSource = webview.cspSource;
        const cspNonce = getNonce();

        const root = webview.asWebviewUri(Control.context.extensionUri).toString();

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

        const html = content.replace(/{(cspNonce|cspSource|root|title|toolkit)}/g, (_substring, token) => {
            switch (token) {
                case 'cspNonce':
                    return cspNonce.toString();

                case 'cspSource':
                    return cspSource.toString();

                case 'root':
                    return root;

                case 'title':
                    return `<title>${this.title}</title>`;

                case 'toolkit':
                    return `<script nonce="${cspNonce}" type="module" src="${toolkitUri.toString()}"></script>`;

                default:
                    return '';
            }
        });

        return Promise.resolve(html);
    }
}
