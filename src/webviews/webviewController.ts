/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { ConfigurationChangeEvent, Disposable } from 'vscode';
import { Control } from '../control';
import { configuration } from '../util/configuration/config';
import { defaults } from '../util/configuration/defaults';
import { Contexts } from '../util/constants';
import { Logger } from '../util/logger';
import { CalcWebviewView } from './calc/calcWebviewView';

export interface Webviews {
    calcWebviewView?: CalcWebviewView | undefined;
}

const wv = {
    enabled: 'webviews.enabled',
};

export class WebviewController implements Disposable {
    private _enabled: boolean;
    private readonly _disposables: Disposable[] = [];

    // webviews
    private _webviews: Webviews = {
        calcWebviewView: undefined,
    };

    constructor() {
        this._enabled = configuration.getParam(wv.enabled) ?? defaults.webviews.enabled;

        this._disposables.push(configuration.onDidChange(this.onConfigurationChanged, this));

        if (this._enabled) {
            Logger.log('Loading Webviews...');

            void Control.setContext(Contexts.WebviewsEnabled, true);

            this._disposables.push(...this.buildWebviews());
        } else {
            void Control.setContext(Contexts.WebviewsEnabled, false);
        }
    }

    dispose() {
        Disposable.from(...this._disposables);
    }

    private onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, wv.enabled)) {
            if (this._enabled) {
                Logger.log('Webviews disabled...');
                void Control.setContext(Contexts.WebviewsEnabled, false);
                // Disable webviews & dispose
                Object.keys(this._webviews).forEach(key => {
                    this._webviews[key as keyof Webviews]?.dispose();
                    this._webviews[key as keyof Webviews] = undefined;
                });
            } else {
                // Enable
                Logger.log('Webviews enabled...');
                void Control.setContext(Contexts.WebviewsEnabled, true);
                this._disposables.push(...this.buildWebviews());
            }
        }

        this._enabled = configuration.getParam(wv.enabled) ?? defaults.webviews.enabled;
    }

    private buildWebviews(): Disposable[] {
        // Build webviews
        return [
            // Calc Webview
            (this._webviews.calcWebviewView = new CalcWebviewView()),
        ];
    }
}
