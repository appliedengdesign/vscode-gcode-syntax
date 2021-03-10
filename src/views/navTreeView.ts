/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';
import {
    commands,
    ConfigurationChangeEvent,
    Range,
    Selection,
    TextDocumentChangeEvent,
    TextEditorRevealType,
    window,
} from 'vscode';
import { configuration } from '../util/config';
import { StatusBar, StatusBarControl } from '../util/statusBar';
import { NavTreeNode } from './nodes/navTreeNode';
import { GView } from './views';
import { constants, Contexts, PIcon } from '../util/constants';
import { GCodeTreeParser } from './providers/gcodeTreeParser';
import { Control } from '../control';
import { Logger } from '../util/logger';
import { ViewCommands } from './viewCommands';

const NavTreeViewInfo = {
    ViewId: 'gcode.views.navTree',
    ViewName: 'Nav Tree',
    CONFIG: {
        AUTOREF: 'navTree.autoRefresh',
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

        // Register View Commands
        this.registerCommands();

        // Initialize StatusBar
        this._statusbar = Control.statusBarController;

        this._autoRefresh = <boolean>configuration.getParam(NavTreeViewInfo.CONFIG.AUTOREF);

        if (this._autoRefresh) {
            this.refresh();
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
                    this.refresh();
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
                    this.refresh();
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
        if (configuration.changed(e, NavTreeViewInfo.CONFIG.AUTOREF)) {
            this._autoRefresh = <boolean>configuration.getParam(NavTreeViewInfo.CONFIG.AUTOREF);
            Logger.log(`Nav Tree AutoRefresh: ${this._autoRefresh ? 'Enabled' : 'Disabled'}`);
        }
    }

    protected registerCommands() {
        // Refresh Command
        commands.registerCommand(
            ViewCommands.RefreshTree,
            () => {
                if (this._editor && this._editor.document) {
                    if (this._editor.document.languageId === constants.langId) {
                        void Control.setContext(Contexts.ViewsNavTreeEnabled, true);
                    }

                    this.refresh();
                }
            },
            this,
        );

        // Selection Command
        commands.registerCommand(
            ViewCommands.TreeSelect,
            range => {
                this.select(range);
            },
            this,
        );
    }

    protected refresh(element?: NavTreeNode): void {
        if (this.parseTree()) {
            if (element) {
                this._onDidChangeTreeData.fire(element);
            } else {
                this._onDidChangeTreeData.fire(undefined);
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
