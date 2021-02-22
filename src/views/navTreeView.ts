/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { 
    commands, 
    ConfigurationChangeEvent, 
    ExtensionContext, 
    Range, 
    Selection, 
    TextDocumentChangeEvent, 
    TextEditorRevealType, 
    window, 
} from 'vscode';
import { configuration } from '../util/config';
import { StatusBarControl, StatusBar } from '../util/statusBar';
import { NavTreeNode } from './nodes/navTreeNode'; 
import { GView } from './views';
import { constants, PIcon } from '../util/constants';
import { GCodeTreeParser } from './providers/gcodeTreeParser';
import { Control } from '../control';

const NavTreeViewInfo = {
    ID: 'gcode.views.navTree',
    NAME: 'Nav Tree',
    CONFIG: {
        AUTOREF: "navTree.autoRefresh"
    },
    CONTEXT: 'navTreeEnabled',
};

const NavTreeStatus = {
    TREEDIRTY: PIcon.ALERT + 'Tree Dirty',
    TREECLEAN: PIcon.CHECK + 'Tree Up to Date'
};




export class NavTreeView extends GView<NavTreeNode> {

    private _children: NavTreeNode[] | undefined;
    private _statusbar: StatusBarControl;
    private readonly treeStatusBar: StatusBar = 'treeStatusBar';

    constructor() {

        super( NavTreeViewInfo.ID, NavTreeViewInfo.NAME);

        // Initialize View
        this.initialize();

        // Register View Commands
        this.registerCommands();

        // Initialize StatusBar
        this._statusbar = Control.statusBarController;

        this._autoRefresh = configuration.getParam(NavTreeViewInfo.CONFIG.AUTOREF);

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

    getChildren(): Promise<NavTreeNode[]> | undefined {

        if (this._children) {
            return Promise.resolve(this._children);
        } else {
            if (this.parseTree()) {
                Promise.resolve(this._children);
            }
        }
        
    }

    protected onActiveEditorChanged(): void {
    
        if ((this._editor = window.activeTextEditor) && this._editor.document.uri.scheme === 'file') {
            //this._editor = window.activeTextEditor;

            const enabled = (this._editor.document.languageId === constants.langId);
            commands.executeCommand('setContext', NavTreeViewInfo.CONTEXT, enabled);

            if (enabled) {
                //this._editor = window.activeTextEditor;
                //this._autoRefresh = configuration.getParam(NavTreeViewInfo.CONFIG.AUTOREF);

                // Update Status Bar
                this._statusbar.updateStatusBar(NavTreeStatus.TREEDIRTY, this.treeStatusBar);

                if (this._autoRefresh) this.refresh();
            }
        } else {
            commands.executeCommand('setContext', NavTreeViewInfo.CONTEXT, false);
            this._statusbar.hideStatusBars();

            this._children = [];
            this._onDidChangeTreeData.fire(undefined);
        }
    }

    protected onDocumentChanged(changeEvent: TextDocumentChangeEvent): void {

        if ((this._editor = window.activeTextEditor) && this._editor.document.uri.scheme === 'file') {
            //this._editor = window.activeTextEditor;

            const enabled = (this._editor.document.languageId === constants.langId);
            commands.executeCommand('setContext', NavTreeViewInfo.CONTEXT, enabled);

            if (enabled) {
                //this._editor = window.activeTextEditor;
                //this._autoRefresh = configuration.getParam(NavTreeViewInfo.CONFIG.AUTOREF);

                // Update Status Bar
                this._statusbar.updateStatusBar(NavTreeStatus.TREEDIRTY, this.treeStatusBar);

                if (this._autoRefresh) this.refresh();
            }
        } else {
            commands.executeCommand('setContext', NavTreeViewInfo.CONTEXT, false);
            this._statusbar.hideStatusBars();

            this._children = [];
            this._onDidChangeTreeData.fire(undefined);
        }
    }


    protected onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, NavTreeViewInfo.CONFIG.AUTOREF)) {
            this._autoRefresh = configuration.getParam(NavTreeViewInfo.CONFIG.AUTOREF);
        }
    }

    protected registerCommands() {

        // Refresh Command
        commands.registerCommand(
            this.getQualifiedCommand('refresh'),
            () => {
                
                if (this._editor && this._editor.document) {
                    if (this._editor.document.languageId === constants.langId) {
                        commands.executeCommand('setContext', NavTreeViewInfo.CONTEXT, true);
                    }
                    
                    this.refresh();
                }
            },
            this
        );

        // Selection Command
        commands.registerCommand(
            this.getQualifiedCommand('select'),
            (range) => {
                this.select(range);
            },
            this
        );
    }

    protected refresh( element?: NavTreeNode): void {
        
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

            if (this._statusbar) this._statusbar.updateStatusBar(NavTreeStatus.TREECLEAN, this.treeStatusBar);

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