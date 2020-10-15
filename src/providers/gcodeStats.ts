/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as vscode from 'vscode';


export class GCodeStatsProvider implements vscode.TreeDataProvider<GCodeStatsNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<GCodeStatsNode | undefined> = new vscode.EventEmitter<GCodeStatsNode | undefined>();
    readonly onDidChangeTreeData: vscode.Event<GCodeStatsNode | undefined> = this._onDidChangeTreeData.event;

    private text = '';
    private tree: Array<GCodeStatsNode>;
    private editor: vscode.TextEditor | undefined;
    private autoRefresh = false;

    constructor(private context: vscode.ExtensionContext) {

        this.tree = [];
        this.editor = vscode.window.activeTextEditor;
        vscode.window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
        vscode.workspace.onDidChangeTextDocument(e => this.onDocumentChanged(e));

    }

    refresh(): void {
        
        this.parseTree();

        this._onDidChangeTreeData.fire(undefined);
    }

    private onActiveEditorChanged(): void {
        if (vscode.window.activeTextEditor) {
            if (vscode.window.activeTextEditor.document.uri.scheme === 'file') {
                const enabled = vscode.window.activeTextEditor.document.languageId === 'gcode';
                vscode.commands.executeCommand('setContext', 'gcodeViewEnabled', enabled);

                if (enabled) {
                    this.editor = vscode.window.activeTextEditor;
                    this.refresh();
                }
            }
        } else {
            vscode.commands.executeCommand('setContext', 'gcodeViewEnabled', false);
        }
    }

    private onDocumentChanged(changeEvent: vscode.TextDocumentChangeEvent): void {
        if (vscode.window.activeTextEditor) {
            if (vscode.window.activeTextEditor.document.uri.scheme === 'file') {
                const enabled = vscode.window.activeTextEditor.document.languageId === 'gcode';
                vscode.commands.executeCommand('setContext', 'gcodeViewEnabled', enabled);

                if (enabled) {
                    this.editor = vscode.window.activeTextEditor;
                    this.refresh();
                }
            }
        } else {
            vscode.commands.executeCommand('setContext', 'gcodeViewEnabled', false);
        }
    }

    getTreeItem(element: any): vscode.TreeItem {
        return element[0];
    }

    getChildren(element?: GCodeStatsNode): Thenable<GCodeStatsNode[]> {

        return Promise.resolve(this.parseTree());

        
    }

    private parseTree(): GCodeStatsNode[] {

        this.text = '';
        this.tree = [];
        const editor = vscode.window.activeTextEditor;

        if (editor && editor.document) {
            this.text = editor.document.getText();

            return this.genStats(this.text);
        } else {
            
            return [];
        }

        return[];
    }

    private genStats(text: string): Array<GCodeStatsNode> {



        return [];
    }
}

export class GCodeStatsNode extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super (label, collapsibleState);
    }

}