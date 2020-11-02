/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { Disposable, ExtensionContext } from "vscode";
import { Config, configuration } from "./util/config";
import { Logger } from "./util/logger";
import { GCodeStatsView } from "./views/gcodeStatsView";

export class Control {

    private static _config: Config | undefined;
    private static _context: ExtensionContext;

    private static _statsView: GCodeStatsView | undefined;
    static get statsView() {
        if (this._statsView == undefined) {
            this._context.subscriptions.push((this._statsView = new GCodeStatsView(this._context)));
        }

        return this._statsView;
    }


    static initialize(context: ExtensionContext, config: Config) {

        this._context = context;
        this._config = config;

        Logger.log('Stats: ' + (configuration.getParam('stats.enabled') ? 'Enabled' : 'Disabled') );
        Logger.log('Stats AutoRefresh: ' + (configuration.getParam('stats.autoRefresh') ? 'Enabled' : 'Disabled') );

        if (config.getParam('stats.enabled')){
            Logger.log("Loading Stats View...");
            context.subscriptions.push((this._statsView = new GCodeStatsView(this._context)));
        } else {
            let disposable: Disposable;
            // eslint-disable-next-line prefer-const
            disposable = configuration.onDidChange( e => {
                if (configuration.changed(e, 'stats.enabled')) {
                    disposable.dispose();
                    Logger.log("Loading Stats View...");
                    context.subscriptions.push((this._statsView = new GCodeStatsView(this._context)));
                }
            });
        }


    }

    static get context() {
        return this._context;
    }

    static get config() {
        return this._config;
    }
}