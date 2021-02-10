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
import { configuration, GCodeUnits } from "../util/config";
import { constants } from "../util/constants";
import { Logger } from "../util/logger";
import { ResourceType } from "./nodes/nodes";
import { StatsNode, StatsType } from "./nodes/statsNode";
import { GCodeRuntimeParser } from "./providers/gcodeRuntimeParser";
import { GView } from "./views";

enum StatsViewInfo {
    ID = 'gcode.views.stats',
    NAME = 'Stats'
}


export class StatsView extends GView<StatsNode> {

    private _children: StatsNode[] | undefined;
    private _units: GCodeUnits;

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
        
        this._units = configuration.getUnits();

        if (this._autoRefresh) {
            this.refresh();
        }

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

    onActiveEditorChanged():void {
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
            } else {
                commands.executeCommand('setContext', 'statsEnabled', false);

                this._children = [];
                this._onDidChangeTreeData.fire(undefined);
            }
        } else {
            commands.executeCommand('setContext', 'statsEnabled', false);

            this._children = [];
            this._onDidChangeTreeData.fire(undefined);
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
            } else {
                commands.executeCommand('setContext', 'statsEnabled', false);

                this._children = [];
                this._onDidChangeTreeData.fire(undefined);
            }
        } else {
            commands.executeCommand('setContext', 'statsEnabled', false);

            this._children = [];
            this._onDidChangeTreeData.fire(undefined);
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
                this._onDidChangeTreeData.fire(element);
            } else {
                this._onDidChangeTreeData.fire(undefined);
            }
        }
    }

    private genStats(): boolean {

        this._children = [];

        if (window.activeTextEditor) {
            this._editor = window.activeTextEditor;

            if (this._editor && this._editor.document) {

                const text = this._editor.document.getText();

                // Generate Tool Change Stats

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
                } else {
                    this._children.push(
                        new StatsNode(
                            StatsType.ERROR,
                            'Tool Changes: ' + 'Error',
                            undefined,
                            ResourceType.Stats,
                            TreeItemCollapsibleState.None,
                            'Error Generating Tool Change Stats'
                        )
                    );
                }


                // Generate Runtime Stats
                if (this.updateRunTime(text)) {
                    this._children.push(
                        new StatsNode(
                            StatsType.RUNTIME,
                            'Est Runtime: ' + new Date( (this._stats.runtime) * 1000).toISOString().substr(11, 8),
                            undefined,
                            ResourceType.Stats,
                            TreeItemCollapsibleState.None,
                            'Runtime'
                        )
                    );
                } else {
                    this._children.push(
                        new StatsNode(
                            StatsType.ERROR,
                            'Est Runtime: Error',
                            undefined,
                            ResourceType.Stats,
                            TreeItemCollapsibleState.None,
                            'Error Generating Runtime Stats'
                        )
                    );
                }


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

    private updateRunTime(text: string): boolean {

        const rtparser = new GCodeRuntimeParser(text, this._units);

        if (rtparser.update()) {
            this._stats.runtime = rtparser.getRuntime();



            return true;
        } else {
            return false;
        }
    }

}
