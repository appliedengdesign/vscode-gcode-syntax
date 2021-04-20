/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import {
    commands,
    ConfigurationChangeEvent,
    Disposable,
    Uri,
    ViewColumn,
    Webview,
    WebviewOptions,
    WebviewPanel,
    WebviewPanelOnDidChangeViewStateEvent,
    window,
} from 'vscode';
import { configuration } from '../util/config';
import { WebViewCommands } from './webviewCommands';
import { constants } from '../util/constants';
import { Control } from '../control';

export abstract class GWebView implements Disposable {
    protected _disposable: Disposable;
    private _panel: WebviewPanel | undefined;
    private _dPanel: Disposable | undefined;
    private _enabled: boolean;

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

        this._enabled = <boolean>configuration.getParam('webviews.enabled');
    }

    private onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (e.affectsConfiguration('webviews.enabled')) {
            this._enabled = <boolean>configuration.getParam('webviews.enabled');
        }
    }

    dispose() {
        this._disposable && this._disposable.dispose();
        this._dPanel && this._dPanel.dispose();
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
        if (this._enabled) {
            void this.show(this._column);
        }
    }

    private onPanelDisposed() {
        this._panel?.dispose();
        this._panel = undefined;
    }

    private onViewStateChanged(e: WebviewPanelOnDidChangeViewStateEvent) {
        if (e.webviewPanel.active) {
            // View State Changed
        }
    }

    async show(column: ViewColumn = ViewColumn.Beside): Promise<void> {
        if (this._panel == null) {
            this._panel = window.createWebviewPanel(
                this.id,
                this.title,
                { viewColumn: column, preserveFocus: false },
                this.getWebviewOptions(),
            );

            this._panel.iconPath = Uri.file(constants.gcodeIcon);

            this._dPanel = Disposable.from(
                this._panel,
                this._panel.onDidDispose(this.onPanelDisposed, this),
                this._panel.onDidChangeViewState(this.onViewStateChanged, this),
            );

            this._panel.webview.html = await this.getHtml(this._panel.webview);
        } else {
            const html = await this.getHtml(this._panel.webview);

            this._panel.webview.html = '';
            this._panel.webview.html = html;

            this._panel.reveal(this._panel.viewColumn ?? ViewColumn.Active, false);
        }
    }

    protected abstract getHtml(webview: Webview): Promise<string>;

    protected getNonce(): string {
        let text = '';

        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    private getWebviewOptions(): WebviewOptions {
        return {
            enableScripts: true,
            enableCommandUris: true,
            localResourceRoots: [Uri.joinPath(Control.context.extensionUri, 'resources', 'webviews')],
        };
    }
}
