/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { 
    commands, 
    Event, 
    EventEmitter, 
    ExtensionContext, 
    Range, 
    Selection, 
    TextDocumentChangeEvent, 
    TextEditor, 
    TextEditorRevealType, 
    TreeDataProvider, 
    TreeItem,  
    window, 
    workspace 
} from 'vscode';
import { configuration } from '../util/config';
import * as gcodeparser from './providers/gcodeTreeParser';
import { StatusBar } from '../util/statusBar';
import { TreeNode } from './nodes/TreeNode';


export class GCodeTreeView implements TreeDataProvider<TreeNode> {

    private _onDidChangeTreeData: EventEmitter<TreeNode | undefined> = new EventEmitter<TreeNode | undefined>();
    readonly onDidChangeTreeData: Event<TreeNode | undefined> = this._onDidChangeTreeData.event;

    private text = '';
    private tree: Array<TreeNode>;
    private editor: TextEditor | undefined;
    private autoRefresh = false;

    constructor(private context: ExtensionContext) {
        this.tree = [];
        this.editor = window.activeTextEditor;
        window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
        workspace.onDidChangeTextDocument(e => this.onDocumentChanged(e));

        this.parseTree();

        this.autoRefresh = configuration.getParam('tree.autoRefresh');

        this.onActiveEditorChanged();

    }

    refresh(): void {
        
        this.parseTree();

        this._onDidChangeTreeData.fire(undefined);
        StatusBar.updateStatusBar('Tree Up to Date');
    }

    private onActiveEditorChanged(): void {
        if (window.activeTextEditor) {
            if (window.activeTextEditor.document.uri.scheme === 'file') {
                const enabled = window.activeTextEditor.document.languageId === 'gcode';
                commands.executeCommand('setContext', 'gcodeTreeViewEnabled', enabled);

                if (enabled) {
                    this.editor = window.activeTextEditor;
                    this.autoRefresh = configuration.getParam('tree.autoRefresh');
                    StatusBar.updateStatusBar('Tree Dirty');
                    if (this.autoRefresh) this.refresh();
                }
            }
        } else {
            //this.tree = [];
            commands.executeCommand('setContext', 'gcodeTreeViewEnabled', false);
            this.refresh();
            StatusBar.hideStatusBar();
        }
    }

    private onDocumentChanged(changeEvent: TextDocumentChangeEvent): void {
        if (window.activeTextEditor) {
            if (window.activeTextEditor.document.uri.scheme === 'file') {
                const enabled = window.activeTextEditor.document.languageId === 'gcode';
                commands.executeCommand('setContext', 'gcodeTreeViewEnabled', enabled);

                if (enabled) {
                    this.editor = window.activeTextEditor;
                    this.autoRefresh = configuration.getParam('tree.autoRefresh');
                    StatusBar.updateStatusBar('Tree Dirty');
                    if (this.autoRefresh) this.refresh();
                }
            }
        } else {
            commands.executeCommand('setContext', 'gcodeTreeViewEnabled', false);
            this.refresh();
            StatusBar.hideStatusBar();
        }
    }

    getTreeItem(element: any): TreeItem {
        return element[0];
    }

    getChildren(element?: TreeNode): Thenable<TreeNode[]> {

        return Promise.resolve(this.parseTree());

        
    }

    private parseTree(): TreeNode[] {

        this.text = '';
        this.tree = [];
        const editor = window.activeTextEditor;
    
        if (editor && editor.document) {
            this.text = editor.document.getText();
    
            const parsed = new gcodeparser.GCodeTreeParser(this.text);
            return parsed.getTree();
    
        } else {
            return [];
        }
    
        return [];
    }

    select(range: Range) {
        if (this.editor) {
            this.editor.selection = new Selection(range.start, range.end);
            this.editor.revealRange(range, TextEditorRevealType.InCenter);
        }
    }
    
}


