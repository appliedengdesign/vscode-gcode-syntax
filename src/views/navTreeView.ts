/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';
import {
    commands,
    ConfigurationChangeEvent,
    Disposable,
    Range,
    Selection,
    TextDocumentChangeEvent,
    TextEditorRevealType,
    window,
} from 'vscode';
import { configuration } from '../util/configuration/config';
import { StatusBar, StatusBarControl } from '../util/statusBar';
import { NavTreeNode } from './nodes/navTreeNode';
import { GView } from './views';
import { constants, Contexts, PIcon, ViewCommands } from '../util/constants';
import { GCodeTreeParser } from './providers/gcodeTreeParser';
import { Control } from '../control';
import { Logger } from '../util/logger';
import { Messages } from '../util/messages';
import { defaults } from '../util/configuration/defaults';

const NavTreeViewInfo = {
    ViewId: 'gcode.views.navTree',
    ViewName: 'Nav Tree',
    Config: {
        AutoRefresh: 'views.navTree.autoRefresh',
        MaxAutoRefresh: 'views.maxAutoRefresh',
    },
    Context: Contexts.ViewsNavTreeEnabled,
};

const NavTreeStatus = {
    TREEDIRTY: `${PIcon.Alert} Tree Dirty`,
    TREECLEAN: `${PIcon.Check} Tree Up to Date`,
};

export class NavTreeView extends GView<NavTreeNode> {
    private _children: NavTreeNode[] | undefined;
    private _statusbar: StatusBarControl;
    private readonly treeStatusBar: StatusBar = 'treeStatusBar';

    constructor() {
        super(NavTreeViewInfo.ViewId, NavTreeViewInfo.ViewName);

        // Initialize View
        this.initialize();

        // Initialize StatusBar
        this._statusbar = Control.statusBarController;

        this._autoRefresh = configuration.getParam(NavTreeViewInfo.Config.AutoRefresh);

        if (this._autoRefresh) {
            void this.refresh();
        }
    }

    dispose() {
        super.dispose();
    }

    getRoot() {
        return undefined;
    }

    async getChildren(): Promise<NavTreeNode[]> {
        if (this._children) {
            return Promise.resolve(this._children);
        } else {
            return [];
        }
    }

    protected onActiveEditorChanged(): void {
        if ((this._editor = window.activeTextEditor) && this._editor.document.uri.scheme === 'file') {
            const enabled = this._editor.document.languageId === constants.langId;
            void Control.setContext(Contexts.ViewsNavTreeEnabled, enabled);

            if (enabled) {
                // Update Status Bar
                this._statusbar.updateStatusBar(
                    NavTreeStatus.TREEDIRTY,
                    this.treeStatusBar,
                    'Refresh Tree',
                    undefined,
                    ViewCommands.RefreshTree,
                );

                if (this._autoRefresh) {
                    void this.refresh();
                }
            }
        } else {
            void Control.setContext(Contexts.ViewsNavTreeEnabled, false);
            this._statusbar.hideStatusBars();

            this._children = [];
            this._onDidChangeTreeData.fire(undefined);
        }
    }

    protected onDocumentChanged(_changeEvent: TextDocumentChangeEvent): void {
        if ((this._editor = window.activeTextEditor) && this._editor.document.uri.scheme === 'file') {
            const enabled = this._editor.document.languageId === constants.langId;
            void Control.setContext(Contexts.ViewsNavTreeEnabled, enabled);

            if (enabled) {
                // Update Status Bar
                this._statusbar.updateStatusBar(
                    NavTreeStatus.TREEDIRTY,
                    this.treeStatusBar,
                    'Refresh Tree',
                    undefined,
                    ViewCommands.RefreshTree,
                );

                if (this._autoRefresh) {
                    void this.refresh();
                }
            }
        } else {
            void Control.setContext(Contexts.ViewsNavTreeEnabled, false);
            this._statusbar.hideStatusBars();

            this._children = [];
            this._onDidChangeTreeData.fire(undefined);
        }
    }

    protected onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, NavTreeViewInfo.Config.AutoRefresh)) {
            this._autoRefresh = configuration.getParam(NavTreeViewInfo.Config.AutoRefresh);
            Logger.log(`Nav Tree AutoRefresh: ${this._autoRefresh ? 'Enabled' : 'Disabled'}`);
        }
    }

    protected registerCommands(): Disposable[] {
        return [
            // Refresh Command
            commands.registerCommand(
                ViewCommands.RefreshTree,
                () => {
                    if (this._editor && this._editor.document) {
                        if (this._editor.document.languageId === constants.langId) {
                            void Control.setContext(Contexts.ViewsNavTreeEnabled, true);
                        }

                        // Refresh View
                        void this.refresh();

                        // Show Tree View
                        void this.show();
                    }
                },
                this,
            ),

            // Selection Command
            commands.registerCommand(
                ViewCommands.TreeSelect,
                range => {
                    this.select(range);
                },
                this,
            ),
        ];
    }

    protected async refresh(element?: NavTreeNode): Promise<void> {
        if (this._editor && this._editor.document) {
            if (
                this._editor.document.lineCount >
                (configuration.getParam<number>(NavTreeViewInfo.Config.MaxAutoRefresh) ?? defaults.views.maxAutoRefresh)
            ) {
                if (await Messages.showRefreshWarningMessage()) {
                    if (this.parseTree()) {
                        if (element) {
                            this._onDidChangeTreeData.fire(element);
                        } else {
                            this._onDidChangeTreeData.fire(undefined);
                        }
                    }
                }
            } else {
                if (this.parseTree()) {
                    if (element) {
                        this._onDidChangeTreeData.fire(element);
                    } else {
                        this._onDidChangeTreeData.fire(undefined);
                    }
                }
            }
        }
    }

    protected parseTree(): boolean {
        this._children = [];

        if (this._editor && this._editor.document) {
            const text = this._editor.document.getText();

            const parsed = new GCodeTreeParser(text);

            this._children = parsed.getTree();

            if (this._statusbar) {
                this._statusbar.updateStatusBar(
                    NavTreeStatus.TREECLEAN,
                    this.treeStatusBar,
                    'Tree is Clean',
                    undefined,
                    undefined,
                );
            }

            return true;
        }

        return false;
    }

    protected select(range: Range) {
        if (this._editor) {
            this._editor.selection = new Selection(range.start, range.end);
            this._editor.revealRange(range, TextEditorRevealType.InCenter);
        }
    }
}
