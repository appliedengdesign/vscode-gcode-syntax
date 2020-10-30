/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { commands, ConfigurationChangeEvent, Event, EventEmitter, TreeItemCollapsibleState, window } from "vscode";
import { configuration } from "../util/config";
import { constants } from "../util/constants";
import { Logger } from "../util/logger";
import { ResourceType } from "./nodes/nodes";
import { StatsNode, StatsType } from "./nodes/StatsNode";
import { GView } from "./views";


export class GCodeStatsView extends GView<StatsNode> {

    private enabled: boolean;
    constructor() {
        super('gcode.views.stats', 'Stats');

        this.enabled = false;
    }

    getRoot() {
        return new StatsNode(
            StatsType.ROOT,
            'Statistics',
            undefined,
            ResourceType.Stats,
            TreeItemCollapsibleState.None,
            undefined
        );
    }

   
    protected registerCommands() {
        // Refresh Command
        commands.registerCommand(
            this.getQualifiedCommand('refresh'),
            () => {
                if (window.activeTextEditor?.document.languageId === constants.langId) {
                    commands.executeCommand('setContext', 'gcodeStatsViewEnabled', true);
                }

                this.refresh();
            },
            this
        );
        
        // Enable stats
        commands.registerCommand(
            this.getQualifiedCommand('enable'),
            () => {
                Logger.log('Enabling Stats...');
                configuration.setParam('stats.enabled', true);
            },
            this
        );
    }

}
