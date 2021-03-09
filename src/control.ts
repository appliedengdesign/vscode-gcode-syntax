/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { commands, Disposable, ExtensionContext } from 'vscode';
import { Config, configuration } from './util/config';
import { Logger } from './util/logger';
import { StatusBarControl } from './util/statusBar';
import { NavTreeView } from './views/navTreeView';
import { GCodeUnitsController } from './gcodeUnits';
import { StatsView } from './views/statsView';
import { constants, Contexts, PIcon, VSBuiltInCommands } from './util/constants';
import { Commands } from './util/commands';
import { Version } from './util/version';
import { Messages } from './util/messages';
import { StateControl } from './util/stateControl';

export class Control {
    private static _config: Config | undefined;
    private static _context: ExtensionContext;
    private static _units: string | undefined;

    // Controllers
    private static _statusBarControl: StatusBarControl;
    private static _unitsController: GCodeUnitsController | undefined;
    private static _stateController: StateControl;

    // Views
    private static _statsView: StatsView | undefined;
    private static _navTree: NavTreeView | undefined;

    static initialize(context: ExtensionContext, config: Config) {
        this._context = context;
        this._config = config;

        // Load State Controller
        this._stateController = new StateControl(context);

        // Load StatusBars
        context.subscriptions.push((this._statusBarControl = new StatusBarControl(this._context)));

        // Units
        this._units = <string>config.getParam('general.units');
        Logger.log(`Units: ${this._units}`);
        if (this._units === 'Auto') {
            // Load Units Monitor
            context.subscriptions.push((this._unitsController = new GCodeUnitsController()));
        } else {
            let disposable: Disposable;
            // eslint-disable-next-line prefer-const
            disposable = configuration.onDidChange(e => {
                if (configuration.changed(e, 'general.units')) {
                    this._units = <string>configuration.getParam('general.units');
                    if (this._units === 'Auto') {
                        disposable.dispose();
                        Logger.log(`Units: ${this._units}`);
                        context.subscriptions.push((this._unitsController = new GCodeUnitsController()));
                    } else {
                        return;
                    }
                }
            });

            this._statusBarControl.updateStatusBar(this._units, 'unitsBar');
        }

        // Load Nav Tree
        Logger.log('Loading Nav Tree...');

        context.subscriptions.push((this._navTree = new NavTreeView()));

        Logger.log(`Nav Tree AutoRefresh: ${configuration.getParam('navTree.autoRefresh') ? 'Enabled' : 'Disabled'}`);

        // Load Stats View
        Logger.log(`Stats: ${configuration.getParam('stats.enabled') ? 'Enabled' : 'Disabled'}`);
        Logger.log(`Stats AutoRefresh: ${configuration.getParam('stats.autoRefresh') ? 'Enabled' : 'Disabled'}`);

        if (config.getParam('stats.enabled')) {
            Logger.log('Loading Stats View...');
            context.subscriptions.push((this._statsView = new StatsView()));
        } else {
            let disposable: Disposable;
            // eslint-disable-next-line prefer-const
            disposable = configuration.onDidChange(e => {
                if (configuration.changed(e, 'stats.enabled')) {
                    disposable.dispose();
                    Logger.log('Loading Stats View...');
                    context.subscriptions.push((this._statsView = new StatsView()));
                }
            });
        }

        // Load Support Heart to Statusbar
        this._statusBarControl.updateStatusBar(
            PIcon.Heart,
            'support',
            'Support G-Code Syntax ❤',
            undefined,
            Commands.GCSUPPORT,
        );

        // Check Version
        void this.checkVersion();
    }

    static terminate() {
        Logger.log('Terminating Extension...');

        // Dispose of status bars
        this._statusBarControl?.dispose();
    }

    static getLoadTime(start: [number, number]): number {
        const [secs, nanosecs] = process.hrtime(start);
        return secs * 1000 + nanosecs / 1000000;
    }

    private static async checkVersion() {
        const gcodeVersion = new Version(constants.extension.version);

        const prevVer = this._stateController.getVersion();

        const newVer = gcodeVersion.compareWith(prevVer.getVersion()) === 1 ? true : false;

        if (newVer) {
            // Extension has been updated

            // Update globalState version
            Logger.log('Updating...');
            void this._stateController.updateVer(gcodeVersion);

            Logger.log(`G-Code upgraded from ${prevVer.getVersionAsString()} to ${gcodeVersion.getVersionAsString()}`);
            await this.showWhatsNew(gcodeVersion);
        } else {
            return;
        }
    }

    private static async showWhatsNew(ver: Version) {
        // Show Whats New Message
        await Messages.showWhatsNewMessage(ver);
    }

    static setContext(key: Contexts | string, value: any) {
        return commands.executeCommand(VSBuiltInCommands.SetContext, key, value);
    }

    static get context() {
        return this._context;
    }

    static get config() {
        return this._config;
    }

    static get navTree() {
        if (this._navTree === undefined) {
            this._context.subscriptions.push((this._navTree = new NavTreeView()));
        }

        return this._navTree;
    }

    static get statsView() {
        if (this._statsView === undefined) {
            this._context.subscriptions.push((this._statsView = new StatsView()));
        }

        return this._statsView;
    }

    static get statusBarController() {
        return this._statusBarControl;
    }

    static get gcodeUnitsController() {
        return this._unitsController;
    }

    static get stateController() {
        return this._stateController;
    }
}
