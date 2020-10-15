/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import { configuration } from '../util/config';
import * as gcodeparser from './gcodeParser';
import { constants } from '../util/constants';
import { StatusBar } from '../util/statusBar';

export class GCodeTreeProvider implements vscode.TreeDataProvider<GCodeTreeNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<GCodeTreeNode | undefined> = new vscode.EventEmitter<GCodeTreeNode | undefined>();
    readonly onDidChangeTreeData: vscode.Event<GCodeTreeNode | undefined> = this._onDidChangeTreeData.event;

    private text = '';
    private tree: Array<GCodeTreeNode>;
    private editor: vscode.TextEditor | undefined;
    private autoRefresh = false;

    constructor(private context: vscode.ExtensionContext) {
        this.tree = [];
        this.editor = vscode.window.activeTextEditor;
        vscode.window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
        vscode.workspace.onDidChangeTextDocument(e => this.onDocumentChanged(e));

        this.parseTree();

        this.autoRefresh = configuration.getParam('treeAutoRefresh');

        this.onActiveEditorChanged();

    }

    refresh(): void {
        
        this.parseTree();

        this._onDidChangeTreeData.fire(undefined);
        StatusBar.updateStatusBar('Tree Up to Date');
    }

    private onActiveEditorChanged(): void {
        if (vscode.window.activeTextEditor) {
            if (vscode.window.activeTextEditor.document.uri.scheme === 'file') {
                const enabled = vscode.window.activeTextEditor.document.languageId === 'gcode';
                vscode.commands.executeCommand('setContext', 'gcodeViewEnabled', enabled);

                if (enabled) {
                    this.editor = vscode.window.activeTextEditor;
                    this.autoRefresh = configuration.getParam('treeAutoRefresh');
                    StatusBar.updateStatusBar('Tree Dirty');
                    if (this.autoRefresh) this.refresh();
                }
            }
        } else {
            //this.tree = [];
            vscode.commands.executeCommand('setContext', 'gcodeViewEnabled', false);
            this.refresh();
            StatusBar.hideStatusBar();
        }
    }

    private onDocumentChanged(changeEvent: vscode.TextDocumentChangeEvent): void {
        if (vscode.window.activeTextEditor) {
            if (vscode.window.activeTextEditor.document.uri.scheme === 'file') {
                const enabled = vscode.window.activeTextEditor.document.languageId === 'gcode';
                vscode.commands.executeCommand('setContext', 'gcodeViewEnabled', enabled);

                if (enabled) {
                    this.editor = vscode.window.activeTextEditor;
                    this.autoRefresh = configuration.getParam('treeAutoRefresh');
                    StatusBar.updateStatusBar('Tree Dirty');
                    if (this.autoRefresh) this.refresh();
                }
            }
        } else {
            vscode.commands.executeCommand('setContext', 'gcodeViewEnabled', false);
            this.refresh();
            StatusBar.hideStatusBar();
        }
    }

    getTreeItem(element: any): vscode.TreeItem {
        return element[0];
    }

    getChildren(element?: GCodeTreeNode): Thenable<GCodeTreeNode[]> {

        return Promise.resolve(this.parseTree());

        
    }

    private parseTree(): GCodeTreeNode[] {

        this.text = '';
        this.tree = [];
        const editor = vscode.window.activeTextEditor;
    
        if (editor && editor.document) {
            this.text = editor.document.getText();
    
            const parsed = new gcodeparser.GCodeParser(this.text);
            return parsed.getTree();
    
        } else {
            return [];
        }
    
        return [];
    }

    select(range: vscode.Range) {
        if (this.editor) {
            this.editor.selection = new vscode.Selection(range.start, range.end);
            this.editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
        }
    }
    
}


export class GCodeTreeNode extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
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