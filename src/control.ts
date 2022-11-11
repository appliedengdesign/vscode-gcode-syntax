/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { commands, ExtensionContext } from 'vscode';
import { Config, configuration } from './util/configuration/config';
import { Logger } from './util/logger';
import { StatusBarControl } from './util/statusBar';
import { NavTreeView } from './views/navTreeView';
import { UnitsController } from './util/unitsController';
import { StatsView } from './views/statsView';
import { constants, Contexts, GCommands, PIcon, VSBuiltInCommands } from './util/constants';
import { Version } from './util/version';
import { Messages } from './util/messages';
import { StateControl } from './util/stateControl';
import { MachineTypeController } from './util/machineTypeController';
import { GCodeHoverControl } from './hovers/gcodeHoverControl';
import { registerCommands } from './util/commands';
import { CalcWebviewView } from './webviews/calc/calcWebviewView';

const cfgAutoRef = {
    navTree: 'views.navTree.autoRefresh',
    stats: 'views.stats.autoRefresh',
};

export class Control {
    private static _config: Config | undefined;
    private static _context: ExtensionContext;
    private static _version: Version;

    // Controllers
    private static _machineTypeController: MachineTypeController;
    private static _statusBarControl: StatusBarControl;
    private static _unitsController: UnitsController;
    private static _stateController: StateControl;
    private static _hoverController: GCodeHoverControl;

    // Views
    private static _statsView: StatsView | undefined;
    private static _navTree: NavTreeView | undefined;

    // Webviews
    private static _calcWebviewView: CalcWebviewView | undefined;

    private static async _checkVersion() {
        const prevVer = this._stateController.getVersion();

        const newVer = this._version.compareWith(prevVer.getVersion()) === 1 ? true : false;

        if (newVer) {
            // Extension has been updated

            // Update globalState version
            Logger.log('Updating...');
            await this._stateController.updateVer(this._version);

            Logger.log(`G-Code upgraded from ${prevVer.getVersionAsString()} to ${this._version.getVersionAsString()}`);
            await this._showWhatsNew(this._version);
        } else {
            return;
        }
    }

    private static async _showWhatsNew(ver: Version) {
        // Show Whats New Message
        await Messages.showWhatsNewMessage(ver);
    }

    // Static Methods
    static initialize(context: ExtensionContext, config: Config) {
        // Initialize G-Code Extension
        this._context = context;
        this._config = config;
        this._version = new Version(constants.extension.version);

        // Initialze Configuration
        Logger.log('Loading Configuration...');
        Config.initialize(this._context, this._config);

        // Load State Controller
        Logger.log('Loading State Controller...');
        this._stateController = new StateControl(context);

        // Check Version
        Logger.log('Checking Version...');
        void this._checkVersion();

        // Register Commands
        Logger.log('Registering Commands...');
        context.subscriptions.push(...registerCommands());

        // Load StatusBars
        context.subscriptions.push((this._statusBarControl = new StatusBarControl()));

        // Load Machine Type
        Logger.log('Loading Machine Type Controller...');
        context.subscriptions.push((this._machineTypeController = new MachineTypeController()));

        // Load Hover Controller
        Logger.log('Loading Hover Controller...');
        context.subscriptions.push((this._hoverController = new GCodeHoverControl()));

        // Load Units Controller
        context.subscriptions.push((this._unitsController = new UnitsController()));

        // Load Nav Tree
        Logger.log('Loading Nav Tree...');
        context.subscriptions.push((this._navTree = new NavTreeView()));

        Logger.log(
            `Nav Tree AutoRefresh: ${configuration.getParam<boolean>(cfgAutoRef.navTree) ? 'Enabled' : 'Disabled'}`,
        );

        // Load Stats View
        Logger.log('Loading Stats View...');
        context.subscriptions.push((this._statsView = new StatsView()));

        Logger.log(`Stats AutoRefresh: ${configuration.getParam<boolean>(cfgAutoRef.stats) ? 'Enabled' : 'Disabled'}`);

        // Load Support Heart to Statusbar
        this._statusBarControl.updateStatusBar(
            PIcon.Heart,
            'support',
            'Support G-Code Syntax ❤',
            undefined,
            GCommands.ShowSupportGCode,
        );

        // Webviews
        context.subscriptions.push((this._calcWebviewView = new CalcWebviewView()));

        Logger.log('Done Initializing.');
    }

    static terminate() {
        Logger.log('Terminating Extension...');

        // Dispose Views
        this._calcWebviewView?.dispose();
        this._statsView?.dispose();
        this._statsView?.dispose();
        this._navTree?.dispose();

        // Dispose Controllers
        this._hoverController.dispose();
        this._unitsController?.dispose();
        this._machineTypeController?.dispose();
        this._statusBarControl?.dispose();
    }

    static getLoadTime(start: [number, number]): number {
        const [secs, nanosecs] = process.hrtime(start);
        return secs * 1000 + nanosecs / 1000000;
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

    static get version() {
        return this._version;
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

    static get unitsController() {
        return this._unitsController;
    }

    static get stateController() {
        return this._stateController;
    }

    static get machineTypeController() {
        return this._machineTypeController;
    }

    static get hoverController() {
        return this._hoverController;
    }

    static get calcWebviewView() {
        return this._calcWebviewView;
    }
}
