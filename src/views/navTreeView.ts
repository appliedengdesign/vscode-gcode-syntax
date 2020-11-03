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
    TextEditor, 
    TextEditorRevealType, 
    window, 
    workspace 
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

    constructor(private context: ExtensionContext) {

        super( NavTreeViewInfo.ID, NavTreeViewInfo.NAME);

        this._editor = window.activeTextEditor;

        this.initialize();

        this.registerCommands();

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

    protected onActiveEditorChanged(editor: TextEditor): void {
    
        if (window.activeTextEditor) {
            this._editor = window.activeTextEditor;

            if (this._editor.document.uri.scheme === 'file') {

                const enabled = this._editor.document.languageId === 'gcode';
                commands.executeCommand('setContext', 'navTreeEnabled', enabled);

                if (enabled) {
                    this._editor = window.activeTextEditor;
                    this._autoRefresh = configuration.getParam('navTree.autoRefresh');
                    StatusBar.updateStatusBar('Tree Dirty');

                    if (this._autoRefresh) this.refresh();
                }
            }
        } else {
            commands.executeCommand('setContext', 'navTreeEnabled', false);
            StatusBar.hideStatusBar();
        }
    }

    protected onDocumentChanged(changeEvent: TextDocumentChangeEvent): void {

        if (window.activeTextEditor) {
            this._editor = window.activeTextEditor;
            
            if (this._editor && this._editor.document.uri.scheme === 'file') {

                const enabled = this._editor.document.languageId === 'gcode';
                commands.executeCommand('setContext', 'navTreeEnabled', enabled);

                if (enabled) {
                    this._editor = window.activeTextEditor;
                    this._autoRefresh = configuration.getParam('navTree.autoRefresh');
                    StatusBar.updateStatusBar('Tree Dirty');

                    if (this._autoRefresh) this.refresh();
                }
            }
        } else {
            commands.executeCommand('setContext', 'navTreeEnabled', false);
            StatusBar.hideStatusBar();
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

    protected async refresh( element?: NavTreeNode): Promise<void> {
        
        if (this.parseTree()) {

            if (element) {
                return Promise.resolve(this._onDidChangeTreeData.fire(element));
            } else {
                return Promise.resolve(this._onDidChangeTreeData.fire(undefined));
            }
        }
    }

    protected parseTree(): boolean {
        this._children = [];

        if (this._editor && this._editor.document) {

            const text = this._editor.document.getText();

            const parsed = new GCodeTreeParser(text);

            this._children = parsed.getTree();

            StatusBar.updateStatusBar('Tree Up To Date');

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