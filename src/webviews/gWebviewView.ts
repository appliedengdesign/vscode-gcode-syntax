/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import {
    CancellationToken,
    commands,
    Disposable,
    Uri,
    Webview,
    WebviewOptions,
    WebviewView,
    WebviewViewProvider,
    WebviewViewResolveContext,
    window,
} from 'vscode';
import { Control } from '../control';
import { Logger } from '../util/logger';

export abstract class GWebviewView implements WebviewViewProvider, Disposable {
    protected readonly _disposables: Disposable[] = [];
    private _view: WebviewView | undefined;
    private _title: string;

    constructor(public readonly id: string, public readonly title: string) {
        this._title = title;

        this._disposables.push(window.registerWebviewViewProvider(id, this));
    }

    dispose() {
        Disposable.from(...this._disposables).dispose();
    }

    get visible() {
        return this._view?.visible ?? false;
    }

    async show(options?: { preserveFocus?: boolean }) {
        try {
            void (await commands.executeCommand(`${this.id}.focus`), options);
        } catch (err) {
            Logger.error(err);
        }
    }

    async resolveWebviewView(
        webviewView: WebviewView,
        _context: WebviewViewResolveContext,
        _token: CancellationToken,
    ): Promise<void> {
        this._view = webviewView;

        webviewView.webview.options = this.getWebviewOptions();
        webviewView.title = this.title;

        webviewView.webview.html = await this.getHtml(this._view.webview);
    }

    protected async refresh(): Promise<void> {
        if (this._view) {
            this._view.webview.html = await this.getHtml(this._view.webview);
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

    protected getWebviewOptions(): WebviewOptions {
        return {
            enableScripts: true,
            // enableCommandUris: true,
            localResourceRoots: [Uri.joinPath(Control.context.extensionUri, 'resources', 'webviews')],
        };
    }
}
