import * as vscode from 'vscode';
import * as path from 'path';
import { config } from '../config';
import * as gcodeparser from './gcodeParser';

export class GCodeTreeProvider implements vscode.TreeDataProvider<GCodeTreeNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<GCodeTreeNode | undefined> = new vscode.EventEmitter<GCodeTreeNode | undefined>();
    readonly onDidChangeTreeData: vscode.Event<GCodeTreeNode | undefined> = this._onDidChangeTreeData.event;

    private text: string = '';
    private tree: Array<GCodeTreeNode>;
    private editor: vscode.TextEditor | undefined;
    private autoRefresh: boolean = true;

    constructor(private context: vscode.ExtensionContext) {
        this.tree = [];
        this.editor = vscode.window.activeTextEditor;
        vscode.window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
        vscode.workspace.onDidChangeTextDocument(e => this.onDocumentChanged(e));

        this.parseTree();

        this.autoRefresh = config.getParam('treeAutoRefresh');

        this.onActiveEditorChanged();

    }

    refresh(): void {
        
        this.parseTree();

        this._onDidChangeTreeData.fire();
    }

    private onActiveEditorChanged(): void {
        if (vscode.window.activeTextEditor) {
            if (vscode.window.activeTextEditor.document.uri.scheme === 'file') {
                const enabled = vscode.window.activeTextEditor.document.languageId === 'gcode';
                vscode.commands.executeCommand('setContext', 'gcodeTreeEnabled', enabled);

                if (enabled) {
                    this.refresh();
                }
            }
        } else {
            vscode.commands.executeCommand('setContext', 'gcodeTreeEnabled', false);
        }
    }

    private onDocumentChanged(changeEvent: vscode.TextDocumentChangeEvent): void {
        if (this.editor) {
            if (this.autoRefresh && changeEvent.document.uri.toString() === this.editor.document.uri.toString()) {
                this.refresh();
            }
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
        let editor = vscode.window.activeTextEditor;
    
        if (editor && editor.document) {
            this.text = editor.document.getText();
    
            let parsed = new gcodeparser.GCodeParser(this.text);
            return parsed.getTree();
    
        } else {
            return [];
        }
    
        return [];
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
                this.iconPath = {
                    light: path.join(__dirname, '..','..', 'resources', 'icons', 'light', 'boolean.svg'),
                    dark: path.join(__dirname, '..', '..', 'resources', 'icons', 'dark', 'boolean.svg')
                };
                break;
            
            case "cwcutting":
                this.iconPath = {
                    light: path.join(__dirname, '..','..', 'resources', 'icons', 'light', 'cwcutting.svg'),
                    dark: path.join(__dirname, '..', '..', 'resources', 'icons', 'dark', 'cwcutting.svg')
                };
                break;

            default:
                this.iconPath = {
                    light: path.join(__dirname, '..','..', 'resources', 'icons', 'light', 'gcode.svg'),
                    dark: path.join(__dirname, '..', '..', 'resources', 'icons', 'dark', 'gcode.svg')
                };
        }

    }

}