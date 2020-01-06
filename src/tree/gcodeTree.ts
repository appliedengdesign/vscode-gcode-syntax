import * as vscode from 'vscode';

export class GCodeTree implements vscode.TreeDataProvider<number> {

    private _onDidChnageTreeData: vscode.EventEmitter<number | null> = new vscode.EventEmitter<number | null>();
    readonly onDidChangeTreeData: vscode.Event<number | null> = this._onDidChnageTreeData.event;

    private editor: vscode.TextEditor;
    private autoRefresh: boolean = true;

    constructor(context: vscode.ExtensionContext) {
        
    }

    getChildren(offset?: number): Thenable<number[]> {

        return null;
    }

    getTreeItem(offset: number): vscode.TreeItem {


        return null;
    }
}

