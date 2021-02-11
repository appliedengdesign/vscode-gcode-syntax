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
import { StatusBar } from '../util/statusBar';
import { NavTreeNode } from './nodes/navTreeNode'; 
import { GView } from './views';
import { constants } from '../util/constants';
import { GCodeTreeParser } from './providers/gcodeTreeParser';

enum NavTreeViewInfo {
    ID = 'gcode.views.navTree',
    NAME = 'Nav Tree'
}


export class NavTreeView extends GView<NavTreeNode> {

    private _children: NavTreeNode[] | undefined;
    private _statusbar: StatusBar;

    constructor(private context: ExtensionContext, statusbar: StatusBar) {

        super( NavTreeViewInfo.ID, NavTreeViewInfo.NAME);

        // Initialize View
        this.initialize();

        // Register View Commands
        this.registerCommands();

        // Initialize StatusBar
        this._statusbar = statusbar;

        this._autoRefresh = configuration.getParam('navTree.autoRefresh');

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
    
        if (window.activeTextEditor) {
            this._editor = window.activeTextEditor;

            if (this._editor && this._editor.document.uri.scheme === 'file') {

                const enabled = this._editor.document.languageId === constants.langId;
                commands.executeCommand('setContext', 'navTreeEnabled', enabled);

                if (enabled) {
                    this._editor = window.activeTextEditor;
                    this._autoRefresh = configuration.getParam('navTree.autoRefresh');
                    this._statusbar.updateStatusBar('Tree Dirty');

                    if (this._autoRefresh) this.refresh();
                }
            } else {
                commands.executeCommand('setContext', 'navTreeEnabled', false);
                this._statusbar.hideStatusBar();

                this._children = [];
                this._onDidChangeTreeData.fire(undefined);
            }
        } else {
            commands.executeCommand('setContext', 'navTreeEnabled', false);
            this._statusbar.hideStatusBar();

            this._children = [];
            this._onDidChangeTreeData.fire(undefined);

        }
    }

    protected onDocumentChanged(changeEvent: TextDocumentChangeEvent): void {

        if (window.activeTextEditor) {
            this._editor = window.activeTextEditor;
            
            if (this._editor && this._editor.document.uri.scheme === 'file') {

                const enabled = this._editor.document.languageId === constants.langId;
                commands.executeCommand('setContext', 'navTreeEnabled', enabled);

                if (enabled) {
                    this._editor = window.activeTextEditor;
                    this._autoRefresh = configuration.getParam('navTree.autoRefresh');
                    this._statusbar.updateStatusBar('Tree Dirty');

                    if (this._autoRefresh) this.refresh();
                }
            } else {
                commands.executeCommand('setContext', 'navTreeEnabled', false);
                this._statusbar.hideStatusBar();
                
                this._children = [];
                this._onDidChangeTreeData.fire(undefined);
            }
        } 
    }


    protected onConfigurationChanged(e: ConfigurationChangeEvent) {
        if (configuration.changed(e, 'navTree.autoRefresh')) {
            this._autoRefresh = configuration.getParam('navTree.autoRefresh');
        }
    }

    protected registerCommands() {

        // Refresh Command
        commands.registerCommand(
            this.getQualifiedCommand('refresh'),
            () => {
                
                if (this._editor && this._editor.document) {
                    if (this._editor.document.languageId === constants.langId) {
                        commands.executeCommand('setContext', 'NavTreeViewEnabled', true);
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

            this._statusbar.updateStatusBar('Tree Up To Date');

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