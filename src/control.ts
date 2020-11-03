/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { Disposable, ExtensionContext } from "vscode";
import { Config, configuration } from "./util/config";
import { Logger } from "./util/logger";
import { NavTreeView } from "./views/navTreeView";
import { StatsView } from "./views/statsView";

export class Control {

    private static _config: Config | undefined;
    private static _context: ExtensionContext;

    private static _statsView: StatsView | undefined;
    static get statsView() {
        if (this._statsView === undefined) {
            this._context.subscriptions.push((this._statsView = new StatsView(this._context)));
        }

        return this._statsView;
    }

    private static _navTree: NavTreeView | undefined;
    static get navTree() {
        if (this._navTree === undefined) {
            this._context.subscriptions.push((this._navTree = new NavTreeView(this._context)));
        }

        return this._navTree;
    }


    static initialize(context: ExtensionContext, config: Config) {

        this._context = context;
        this._config = config;

        // Load Nav Tree

        Logger.log('Loading Nav Tree...');

        context.subscriptions.push((this._navTree = new NavTreeView(this._context)));

        Logger.log('Nav Tree AutoRefresh: ' + (configuration.getParam('navTree.autoRefresh') ? 'Enabled' : 'Disabled') );


        // Load Stats View

        Logger.log('Stats: ' + (configuration.getParam('stats.enabled') ? 'Enabled' : 'Disabled') );
        Logger.log('Stats AutoRefresh: ' + (configuration.getParam('stats.autoRefresh') ? 'Enabled' : 'Disabled') );

        if (config.getParam('stats.enabled')){
            Logger.log('Loading Stats View...');
            context.subscriptions.push((this._statsView = new StatsView(this._context)));
        } else {
            let disposable: Disposable;
            // eslint-disable-next-line prefer-const
            disposable = configuration.onDidChange( e => {
                if (configuration.changed(e, 'stats.enabled')) {
                    disposable.dispose();
                    Logger.log('Loading Stats View...');
                    context.subscriptions.push((this._statsView = new StatsView(this._context)));
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