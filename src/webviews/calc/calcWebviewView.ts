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
import { Logger } from '../../util/logger';
import { GWebviewView } from '../gWebviewView';
import { getNonce } from '../helpers';
import { WebviewMsg } from '../webviewMsg.types';

export class CalcWebviewView extends GWebviewView {
    private _shortId: string;

    constructor() {
        super(Webviews.CalcWebviewView, WebviewTitles.CalcWebviewView);

        this._shortId = this.id.split('.').pop() ?? '';

        if ((this._enabled = configuration.getParam(`${this.id.slice(6)}.enabled`) ?? defaults.webviews.calc.enabled)) {
            Logger.log('Loading Calculator...');
            void Control.setContext(Contexts.CalcWebviewViewEnabled, true);
        }

        this._disposables.push(
            configuration.onDidChange(this._onConfigurationChanged, this),
            Control.unitsController.onDidChangeUnits(() => this._changeUnits()),
        );
    }

    dispose() {
        super.dispose();
    }

    private _onConfigurationChanged(e: ConfigurationChangeEvent) {
        // Enable / Disable Calculator Webview
        if (configuration.changed(e, `${this.id.slice(6)}.enabled`)) {
            if (this._enabled) {
                // Disable
                void Control.setContext(Contexts.CalcWebviewViewEnabled, false);
                Logger.log('Disabling Calculator...');
            } else {
                // Enable
                Logger.log('Loading Calculator...');
                void Control.setContext(Contexts.CalcWebviewViewEnabled, true);
            }

            this._enabled = configuration.getParam(`${this.id.slice(6)}.enabled`) ?? defaults.webviews.calc.enabled;
        }
    }

    protected override registerCommands(): Disposable[] {
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

    protected override async handleMessage(msg: WebviewMsg): Promise<void> {
        const type = msg.type;

        switch (type) {
            case 'getUnits':
                await this.postMessage({ type: 'changeUnits', payload: Control.unitsController.units });

                break;

            default:
                return;
        }
    }

    protected async getHtml(webview: Webview): Promise<string> {
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

    private _changeUnits() {
        if (this._enabled) {
            void this.postMessage({ type: 'changeUnits', payload: Control.unitsController.units });
        }
    }
}
