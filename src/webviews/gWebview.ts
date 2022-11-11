/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import {
    Disposable,
    Uri,
    ViewColumn,
    Webview,
    WebviewOptions,
    WebviewPanel,
    WebviewPanelOnDidChangeViewStateEvent,
    window,
} from 'vscode';
import { constants, WebviewCommands } from '../util/constants';
import { Control } from '../control';

export abstract class GWebview implements Disposable {
    protected _disposables: Disposable[] = [];
    private _panel: WebviewPanel | undefined;
    private _dPanel: Disposable | undefined;
    private _title: string;

    constructor(
        public readonly id: string,
        title: string,
        showCommand: WebviewCommands,
        private readonly _column?: ViewColumn,
    ) {
        this._title = title;
        this._disposables.push(...this.registerCommands());
    }

    dispose() {
        Disposable.from(...this._disposables).dispose();
        this._dPanel?.dispose();
    }

    hide() {
        this._panel?.dispose();
    }

    get visible() {
        return this._panel?.visible ?? false;
    }

    get title(): string {
        return this._panel?.title ?? this._title;
    }

    setTitle(title: string) {
        this._title = title;
        if (this._panel) {
            this._panel.title = title;
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

    protected onShowCommand(): void {
        void this.show();
    }

    async show(column: ViewColumn = ViewColumn.Beside): Promise<void> {
        if (!this._panel) {
            this._panel = window.createWebviewPanel(
                this.id,
                this._title,
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

    async refresh(): Promise<void> {
        if (this._panel) {
            this._panel.webview.html = await this.getHtml(this._panel.webview);
        }
    }

    protected abstract getHtml(webview: Webview): Promise<string>;
    protected abstract registerCommands(): Disposable[];

    private getWebviewOptions(): WebviewOptions {
        return {
            enableScripts: true,
            enableCommandUris: true,
            localResourceRoots: [Uri.joinPath(Control.context.extensionUri)],
        };
    }
}
