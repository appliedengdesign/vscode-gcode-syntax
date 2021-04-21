/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import {
    commands,
    ConfigurationChangeEvent,
    TextDocumentChangeEvent,
    ThemeIcon,
    TreeItemCollapsibleState,
    window,
} from 'vscode';
import { Control } from '../control';
import { configuration } from '../util/config';
import { constants, Contexts } from '../util/constants';
import { Logger } from '../util/logger';
import { Messages } from '../util/messages';
import { ResourceType } from './nodes/nodes';
import { StatsNode, StatsType } from './nodes/statsNode';
import { GCodeRuntimeParser } from './providers/gcodeRuntimeParser';
import { ViewCommands } from './viewCommands';
import { GView } from './views';

const StatsViewInfo = {
    ViewId: 'gcode.views.stats',
    ViewName: 'Stats',
    Config: {
        AutoRefresh: 'views.stats.autoRefresh',
        MaxAutoRefresh: 'views.maxAutoRefresh',
    },
    Context: Contexts.ViewsStatsEnabled,
};

export class StatsView extends GView<StatsNode> {
    private _children: StatsNode[] | undefined;

    private _stats = {
        toolchanges: 0,
        runtime: 0,
    };

    constructor() {
        super(StatsViewInfo.ViewId, StatsViewInfo.ViewName);

        this._editor = window.activeTextEditor;

        this.initialize();

        this.registerCommands();

        this._autoRefresh = <boolean>configuration.getParam(StatsViewInfo.Config.AutoRefresh);

        if (this._autoRefresh) {
            void this.refresh();
        }
    }

    dispose() {
        super.dispose();
    }

    getRoot() {
        return new StatsNode(
            StatsType.Root,
            'Statistics',
            undefined,
            ResourceType.Stats,
            TreeItemCollapsibleState.None,
            undefined,
        );
    }

    async getChildren(): Promise<StatsNode[]> {
        if (this._children === undefined) {
            this._children = [
                new StatsNode(
                    StatsType.ToolChanges,
                    `Tool Changes: ${this._stats.toolchanges}`,
                    undefined,
                    ResourceType.Stats,
                    TreeItemCollapsibleState.None,
                    undefined,
                ),
                new StatsNode(
                    StatsType.RunTime,
                    `Runtime: ${this._stats.runtime}`,
                    undefined,
                    ResourceType.Stats,
                    TreeItemCollapsibleState.None,
                    undefined,
                ),
            ];
        }

        return Promise.resolve(this._children);
    }

    protected onActiveEditorChanged(): void {
        if ((this._editor = window.activeTextEditor) && this._editor.document.uri.scheme === 'file') {
            const enabled = this._editor.document.languageId === constants.langId;
            void Control.setContext(Contexts.ViewsStatsEnabled, enabled);

            if (enabled) {
                if (this._autoRefresh) {
                    void this.refresh();
                }
            }
        } else {
            void Control.setContext(Contexts.ViewsStatsEnabled, false);

            this._children = [this.placeholder()];
            this._onDidChangeTreeData.fire(undefined);
        }
    }

    protected onDocumentChanged(_changeEvent: TextDocumentChangeEvent) {
        if ((this._editor = window.activeTextEditor) && this._editor.document.uri.scheme === 'file') {
            const enabled = this._editor.document.languageId === constants.langId;
            void Control.setContext(Contexts.ViewsStatsEnabled, enabled);

            if (enabled) {
                if (this._autoRefresh) {
                    void this.refresh();
                }
            }
        } else {
            void Control.setContext(Contexts.ViewsStatsEnabled, false);

            this._children = [this.placeholder()];
            this._onDidChangeTreeData.fire(undefined);
        }
    }

    protected onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, StatsViewInfo.Config.AutoRefresh)) {
            this._autoRefresh = <boolean>configuration.getParam(StatsViewInfo.Config.AutoRefresh);
            Logger.log(`Stats AutoRefresh: ${this._autoRefresh ? 'Enabled' : 'Disabled'}`);
        }
    }

    protected registerCommands() {
        // Refresh Command
        commands.registerCommand(
            ViewCommands.RefreshStats,
            () => {
                if (window.activeTextEditor?.document.languageId === constants.langId) {
                    void Control.setContext(Contexts.ViewsStatsEnabled, true);
                }

                void this.refresh();
            },
            this,
        );
    }

    protected async refresh(element?: StatsNode): Promise<void> {
        if (this._editor && this._editor.document) {
            if (this._editor.document.lineCount > <number>configuration.getParam(StatsViewInfo.Config.MaxAutoRefresh)) {
                if (await Messages.showRefreshWarningMessage()) {
                    if (this.genStats()) {
                        if (element) {
                            this._onDidChangeTreeData.fire(element);
                        } else {
                            this._onDidChangeTreeData.fire(undefined);
                        }
                    }
                }
            } else {
                if (this.genStats()) {
                    if (element) {
                        this._onDidChangeTreeData.fire(element);
                    } else {
                        this._onDidChangeTreeData.fire(undefined);
                    }
                }
            }
        }
    }

    private genStats(): boolean {
        this._children = [];

        if ((this._editor = window.activeTextEditor) && this._editor.document) {
            // this._editor = window.activeTextEditor;

            const text = this._editor.document.getText();

            // Generate Tool Change Stats

            if (this.updateToolChanges(text)) {
                this._children.push(
                    new StatsNode(
                        StatsType.ToolChanges,
                        `Tool Changes: ${this._stats.toolchanges}`,
                        undefined,
                        ResourceType.Stats,
                        TreeItemCollapsibleState.None,
                        'Tool Changes',
                    ),
                );
            } else {
                this._children.push(
                    new StatsNode(
                        StatsType.Error,
                        'Tool Changes: ' + 'Error',
                        undefined,
                        ResourceType.Stats,
                        TreeItemCollapsibleState.None,
                        'Error Generating Tool Change Stats',
                    ),
                );
            }

            // Generate Runtime Stats
            if (this.updateRunTime(text)) {
                this._children.push(
                    new StatsNode(
                        StatsType.RunTime,
                        `Est Runtime: ${new Date(this._stats.runtime * 1000).toISOString().substr(11, 8)}`,
                        undefined,
                        ResourceType.Stats,
                        TreeItemCollapsibleState.None,
                        'Runtime',
                    ),
                );
            } else {
                this._children.push(
                    new StatsNode(
                        StatsType.Error,
                        'Est Runtime: Error',
                        undefined,
                        ResourceType.Stats,
                        TreeItemCollapsibleState.None,
                        'Error Generating Runtime Stats',
                    ),
                );
            }

            return true;
        }

        return false;
    }

    private updateToolChanges(text: string): boolean {
        const re = /(M0?6)/gim;
        const num = text.match(re)?.length || 0;

        this._stats.toolchanges = num;

        return true;
    }

    private updateRunTime(text: string): boolean {
        const rtparser = new GCodeRuntimeParser(text);

        if (rtparser.update()) {
            this._stats.runtime = rtparser.getRuntime();

            return true;
        } else {
            return false;
        }
    }

    private placeholder(): StatsNode {
        const ph = new StatsNode(
            StatsType.Info,
            'AutoRefresh is Disabled',
            undefined,
            ResourceType.Stats,
            TreeItemCollapsibleState.None,
        );

        ph.iconPath = new ThemeIcon('extensions-info-message');

        return ph;
    }
}
