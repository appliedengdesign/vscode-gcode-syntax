/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

interface VsCodeApi {
    postMessage(msg: any): void;
    setState(state: any): void;
    getState(): any;
}

declare function acquireVsCodeApi(): VsCodeApi;

export abstract class GWebviewApp {
    private readonly _api: VsCodeApi;

    constructor(protected readonly appName: string) {
        this._api = acquireVsCodeApi();
    }

    private registerEvents(): void {
        window.addEventListener('message', this.onMsgReceived.bind(this));
    }

    private postMessage(msg: any): void {
        this._api.postMessage(msg);
    }

    protected abstract onMsgReceived(e: MessageEvent): void;
}
