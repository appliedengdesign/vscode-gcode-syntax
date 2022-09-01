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
import { WebviewMsg } from './webviewMsg.types';

export abstract class GWebviewView implements WebviewViewProvider, Disposable {
    protected readonly _disposables: Disposable[] = [];
    protected _enabled: boolean | undefined;
    private _view: WebviewView | undefined;
    private _title: string;

    constructor(public readonly id: string, title: string) {
        this._title = title;

        this._disposables.push(window.registerWebviewViewProvider(id, this), ...(this.registerCommands?.() ?? []));
    }

    dispose() {
        Disposable.from(...this._disposables).dispose();
    }

    isEnabled(): boolean {
        return this._enabled ?? false;
    }

    disable() {
        this._enabled = false;
    }

    get visible() {
        return this._view?.visible ?? false;
    }

    get title(): string {
        return this._view?.title ?? this._title;
    }

    set title(title: string) {
        this._title = title;
        if (this._view) {
            this._view.title = title;
        }
    }

    get description(): string | undefined {
        return this._view?.description;
    }

    set description(desc: string | undefined) {
        if (this._view) {
            this._view.description = desc;
        }
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

        this._disposables.push(this._view.webview.onDidReceiveMessage(this.onMessageReceived, this));

        await this.refresh();
    }

    protected async refresh(): Promise<void> {
        if (this._view) {
            this._view.webview.html = await this.getHtml(this._view.webview);
        }
    }

    protected abstract getHtml(webview: Webview): Promise<string>;
    protected registerCommands?(): Disposable[];
    protected handleMessage?(msg: WebviewMsg): void;

    protected getWebviewOptions(): WebviewOptions {
        return {
            enableScripts: true,
            enableCommandUris: true,
            localResourceRoots: [Uri.joinPath(Control.context.extensionUri)],
        };
    }

    protected onMessageReceived(msg: WebviewMsg): void {
        if (msg) {
            this.handleMessage?.(msg);
        } else {
            return;
        }
    }

    protected async postMessage(msg: WebviewMsg) {
        if (this._view) {
            return await this._view.webview.postMessage(msg);
        } else {
            return Promise.resolve(false);
        }
    }
}
