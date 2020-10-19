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
    TreeItemCollapsibleState, 
    window, 
    workspace 
} from 'vscode';
import * as path from 'path';
import { configuration } from '../util/config';
import * as gcodeparser from './gcodeParser';
import { constants } from '../util/constants';
import { StatusBar } from '../util/statusBar';


export class GCodeTreeProvider implements TreeDataProvider<GCodeTreeNode> {

    private _onDidChangeTreeData: EventEmitter<GCodeTreeNode | undefined> = new EventEmitter<GCodeTreeNode | undefined>();
    readonly onDidChangeTreeData: Event<GCodeTreeNode | undefined> = this._onDidChangeTreeData.event;

    private text = '';
    private tree: Array<GCodeTreeNode>;
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

    getChildren(element?: GCodeTreeNode): Thenable<GCodeTreeNode[]> {

        return Promise.resolve(this.parseTree());

        
    }

    private parseTree(): GCodeTreeNode[] {

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


export class GCodeTreeNode extends TreeItem {

    constructor(
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
    }

    setIcon(type: string): void {

        switch (type) {
            case "toolchange":
            case "rapid":    
            case "cutting":
            case "cwcutting":
            case "ccwcutting":
            case "coolanton":
            case "coolantoff":
            case "extsubprog":
            case "localsubprog":
            case "subprogreturn":
            case "workoffset":
            case "spindlecw":
            case "spindleccw":
                this.iconPath = {
                    light: path.join(constants.iconsPath, 'light', type+'.svg'),
                    dark: path.join(constants.iconsPath, 'dark', type+'.svg')
                };
                break;

            default:
                this.iconPath = {
                    light: path.join(constants.iconsPath, 'light', 'gcode.svg'),
                    dark: path.join(constants.iconsPath, 'dark', 'gcode.svg')
                };
        }

    }

}