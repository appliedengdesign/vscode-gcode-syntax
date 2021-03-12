/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { commands, ConfigurationChangeEvent, Disposable, Uri, ViewColumn, Webview, WebviewPanel, window } from 'vscode';
import { configuration } from '../util/config';
import { WebViewCommands } from './webviewCommands';
import { constants } from '../util/constants';

export abstract class GWebView implements Disposable {
    protected _disposable: Disposable;
    private _panel: WebviewPanel | undefined;

    constructor(
        public readonly id: string,
        public readonly title: string,
        showCommand: WebViewCommands,
        private readonly _column?: ViewColumn,
    ) {
        this._disposable = Disposable.from(
            configuration.onDidChange(this.onConfigurationChanged, this),
            commands.registerCommand(showCommand, this.onShowCommand, this),
        );
    }

    dispose() {
        this._disposable && this._disposable.dispose();
    }

    hide() {
        this._panel?.dispose();
    }

    get visible() {
        return this._panel?.visible ?? false;
    }

    setTitle(title: string) {
        if (this._panel == null) {
            return;
        }

        this._panel.title = title;
    }

    protected onShowCommand() {
        void this.show(this._column);
    }

    async show(column: ViewColumn = ViewColumn.Beside): Promise<void> {
        if (this._panel == null) {
            this._panel = window.createWebviewPanel(
                this.id,
                this.title,
                { viewColumn: column, preserveFocus: false },
                {
                    retainContextWhenHidden: false,
                    enableFindWidget: true,
                    enableCommandUris: true,
                    enableScripts: true,
                },
            );

            this._panel.iconPath = Uri.file(constants.gcodeIcon);

            this._panel.webview.html = await this.getHtml(this._panel.webview);
        } else {
            const html = await this.getHtml(this._panel.webview);

            this._panel.webview.html = '';
            this._panel.webview.html = html;

            this._panel.reveal(this._panel.viewColumn ?? ViewColumn.Active, false);
        }
    }

    protected abstract onConfigurationChanged(e: ConfigurationChangeEvent): void;

    protected abstract getHtml(webview: Webview): Promise<string>;
}
