/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { WebviewMsg } from '../../webviewMsg.types';

declare let __BOOTSTRAP__: WebviewMsg;

interface VsCodeApi {
    postMessage(msg: any): void;
    setState(state: any): void;
    getState(): any;
}

declare function acquireVsCodeApi(): VsCodeApi;

export abstract class GWebviewApp {
    private readonly _api: VsCodeApi;
    protected bootstrap: WebviewMsg | undefined;

    constructor(protected readonly appName: string) {
        // Get Bootstrap if any
        if (typeof __BOOTSTRAP__ !== 'undefined') {
            this.bootstrap = __BOOTSTRAP__;
        }

        this._api = acquireVsCodeApi();
        this._registerEvents();
    }

    private _registerEvents(): void {
        window.addEventListener('message', this.onMsgReceived.bind(this));
    }

    protected postMessage(msg: any): void {
        this._api.postMessage(msg);
    }

    protected getState(): any {
        return this._api.getState();
    }

    protected setState(state: any): void {
        this._api.setState(state);
    }

    protected abstract onMsgReceived(e: MessageEvent): void;
}
