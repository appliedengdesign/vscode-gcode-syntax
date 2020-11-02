/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { 
    commands,
    ConfigurationChangeEvent,
    ExtensionContext,
    TextDocumentChangeEvent,
    TextEditor,
    TreeItemCollapsibleState,
    window 
} from "vscode";
import { configuration } from "../util/config";
import { constants } from "../util/constants";
import { Logger } from "../util/logger";
import { ResourceType } from "./nodes/nodes";
import { StatsNode, StatsType } from "./nodes/statsNode";
import { GView } from "./views";

enum StatsViewInfo {
    ID = 'gcode.views.stats',
    NAME = 'Stats'
}


export class StatsView extends GView<StatsNode> {

    private _children: StatsNode[] | undefined;

    private _stats = {
        toolchanges: 0,
        runtime: 0
    };

    constructor(private context: ExtensionContext) {
        super(StatsViewInfo.ID, StatsViewInfo.NAME);

        this._editor = window.activeTextEditor;

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

    onActiveEditorChanged(editor: TextEditor):void {
        if (window.activeTextEditor) {
            this._editor = window.activeTextEditor;

            if (this._editor.document.uri.scheme === 'file') {

                const enabled = this._editor.document.languageId === 'gcode';
                commands.executeCommand('setContext', 'statsEnabled', enabled);

                if (enabled) {
                    this._editor = window.activeTextEditor;
                    this._autoRefresh = configuration.getParam('stats.autoRefresh');

                    if (this._autoRefresh) this.refresh();
                }
            }
        } else {
            commands.executeCommand('setContext', 'statsEnabled', false);
        }
    }

    onDocumentChanged(changeEvent: TextDocumentChangeEvent) {
        if (window.activeTextEditor) {
            this._editor = window.activeTextEditor;

            if (this._editor.document.uri.scheme === 'file') {

                const enabled = this._editor.document.languageId === 'gcode';
                commands.executeCommand('setContext', 'statsEnabled', enabled);

                if (enabled) {
                    this._editor = window.activeTextEditor;
                    this._autoRefresh = configuration.getParam('stats.autoRefresh');

                    if (this._autoRefresh) this.refresh();
                }
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
        if (this.genStats()) {

            if (element) {
                return Promise.resolve(this._onDidChangeTreeData.fire(element));
            } else {
                return Promise.resolve(this._onDidChangeTreeData.fire(undefined));
            }
        }
    }

    private genStats(): boolean {

        this._children = [];

        if (this._editor && this._editor.document) {

            const text = this._editor.document.getText();

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

                return true;
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
