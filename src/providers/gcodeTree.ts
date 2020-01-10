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
    private autoRefresh: boolean = false;

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
        if (this.editor && this.autoRefresh) {
                this.refresh();
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
                    light: path.join(__dirname, '..','..', 'resources', 'icons', 'light', 'toolchange.svg'),
                    dark: path.join(__dirname, '..', '..', 'resources', 'icons', 'dark', 'toolchange.svg')
                };
                break;

            case "rapid":
                this.iconPath = {
                    light: path.join(__dirname, '..','..', 'resources', 'icons', 'light', 'rapid.svg'),
                    dark: path.join(__dirname, '..', '..', 'resources', 'icons', 'dark', 'rapid.svg')
                };
                break;
            
            case "cutting":
                this.iconPath = {
                    light: path.join(__dirname, '..','..', 'resources', 'icons', 'light', 'cutting.svg'),
                    dark: path.join(__dirname, '..', '..', 'resources', 'icons', 'dark', 'cutting.svg')
                };
                break;
            
            case "cwcutting":
                this.iconPath = {
                    light: path.join(__dirname, '..','..', 'resources', 'icons', 'light', 'cwcutting.svg'),
                    dark: path.join(__dirname, '..', '..', 'resources', 'icons', 'dark', 'cwcutting.svg')
                };
                break;

            case "ccwcutting":
                this.iconPath = {
                    light: path.join(__dirname, '..','..', 'resources', 'icons', 'light', 'ccwcutting.svg'),
                    dark: path.join(__dirname, '..', '..', 'resources', 'icons', 'dark', 'ccwcutting.svg')
                };
                break;

            case "coolanton":
                this.iconPath = {
                    light: path.join(__dirname, '..','..', 'resources', 'icons', 'light', 'coolanton.svg'),
                    dark: path.join(__dirname, '..', '..', 'resources', 'icons', 'dark', 'coolanton.svg')
                };
                break;
            
            case "coolantoff":
                this.iconPath = {
                    light: path.join(__dirname, '..','..', 'resources', 'icons', 'light', 'coolantoff.svg'),
                    dark: path.join(__dirname, '..', '..', 'resources', 'icons', 'dark', 'coolantoff.svg')
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