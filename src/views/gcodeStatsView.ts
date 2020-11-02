/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { NODATA } from "dns";
import { config } from "process";
import { 
    commands,
    ConfigurationChangeEvent,
    ExtensionContext,
    TextDocumentChangeEvent,
    TreeItemCollapsibleState,
    window 
} from "vscode";
import { configuration } from "../util/config";
import { constants } from "../util/constants";
import { Logger } from "../util/logger";
import { ResourceType } from "./nodes/nodes";
import { StatsNode, StatsType } from "./nodes/StatsNode";
import { GView } from "./views";

enum StatsView {
    ID = 'gcode.views.stats',
    NAME = 'Stats'
}


export class GCodeStatsView extends GView<StatsNode> {

    private _children: StatsNode[] | undefined;

    private _stats = {
        toolchanges: 0,
        runtime: 0
    };

    constructor(private context: ExtensionContext) {
        super(StatsView.ID, StatsView.NAME);


        this.initialize();

        this.registerCommands();

        this._autoRefresh = configuration.getParam('stats.autoRefresh');

    }

    dispose() {
        super.dispose();
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

    getChildren(): StatsNode[] {

        if (this._children === undefined) {

            this._children = 
            [new StatsNode(
                StatsType.TOOLCHANGES,
                'Tool Changes: ' + this._stats.toolchanges,
                undefined,
                ResourceType.Stats,
                TreeItemCollapsibleState.None,
                undefined
            ),
            new StatsNode(
                StatsType.RUNTIME,
                "Runtime: " + this._stats.runtime,
                undefined,
                ResourceType.Stats,
                TreeItemCollapsibleState.None,
                undefined
            )
        ];
        } 
        
        return this._children;
    }

    onDocumentChanged(changeEvent: TextDocumentChangeEvent) {
        if (window.activeTextEditor && window.activeTextEditor.document.uri.scheme === 'file') {

            const enabled = window.activeTextEditor.document.languageId === 'gcode';
            commands.executeCommand('setContext', 'statsViewEnabled', enabled);

            if (enabled) {
                this._editor = window.activeTextEditor;
                

            }
        }
    }

    protected onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, 'stats.autoRefresh')) {
            this._autoRefresh = configuration.getParam('stats.autoRefresh');
        }
    }
   
    protected registerCommands() {
        // Refresh Command
        commands.registerCommand(
            this.getQualifiedCommand('refresh'),
            () => {
                if (window.activeTextEditor?.document.languageId === constants.langId) {
                    commands.executeCommand('setContext', 'StatsViewEnabled', true);
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

    protected async refresh( element?: StatsNode): Promise<void> {
        this.genStats();

        if (element) {
            return Promise.resolve(this._onDidChangeTreeData.fire(element));
        } else {
            return Promise.resolve(this._onDidChangeTreeData.fire(undefined));
        }
    }

    private genStats(): boolean {

        const editor = window.activeTextEditor;

        this._children = [];

        if (editor && editor.document) {

            const text = editor.document.getText();

            if (this.updateToolChanges(text)) {
                this._children.push(
                    new StatsNode(
                        StatsType.TOOLCHANGES,
                        'Tool Changes: ' + this._stats.toolchanges,
                        undefined,
                        ResourceType.Stats,
                        TreeItemCollapsibleState.None,
                        'Tool Changes'
                    )
                );
            }


        }

        return false;
    }

    private updateToolChanges(text: string): boolean {

        const re = /(M0?6)/igm;
        const num = text.match(re)?.length || 0;

        this._stats.toolchanges = num;

        return true;


    }

}
