/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { ConfigurationChangeEvent, Disposable, languages, TextEditor, Uri, window } from 'vscode';
import { configuration } from '../util/configuration/config';
import { constants } from '../util/constants';
import { Logger } from '../util/logger';
import { GCodeHoverProvider } from './gcodeHoverProvider';

export class GCodeHoverControl implements Disposable {
    private readonly _disposable: Disposable;
    private _hoverProvider: Disposable | undefined;
    private _enabled: boolean;
    private _uri: Uri | undefined;

    constructor() {
        this._disposable = Disposable.from(configuration.onDidChange(this.onConfigurationChanged, this));

        this._enabled = <boolean>configuration.getParam('general.hovers.enabled');

        if (this._enabled) {
            Logger.log('Loading Hover Controller...');
            this.register(window.activeTextEditor);
        }
    }

    dispose() {
        this.unregister();
        this._disposable && this._disposable.dispose();
    }

    private onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, 'general.hovers.enabled')) {
            if (this._enabled) {
                // Disable and Dispose
                Logger.log('Disabling Hover Controller...');
                this.unregister();
            } else {
                // Enable
                Logger.log('Enabling Hover Controller...');
                this.register(window.activeTextEditor);
            }
        }
    }

    private unregister(): void {
        if (this._hoverProvider != null) {
            this._hoverProvider.dispose();
            this._hoverProvider = undefined;
        }
    }

    private register(editor: TextEditor | undefined) {
        this.unregister();

        if (editor == null) {
            return;
        }

        if (this._enabled) {
            this._hoverProvider = Disposable.from(
                languages.registerHoverProvider({ language: constants.langId }, new GCodeHoverProvider()),
            );
        }
    }
}
