import * as vscode from 'vscode';
import * as path from 'path';

export class GCodeTreeProvider implements vscode.TreeDataProvider<GCodeTreeNode> {

    private _onDidChnageTreeData: vscode.EventEmitter<GCodeTreeNode | undefined> = new vscode.EventEmitter<GCodeTreeNode | undefined>();
    readonly onDidChangeTreeData: vscode.Event<GCodeTreeNode | undefined> = this._onDidChnageTreeData.event;

    private text: string = '';
    private autoRefresh: boolean = true;

    constructor(context: vscode.ExtensionContext) {
        
        vscode.window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
        

        this.onActiveEditorChanged();
    }

    refresh(): void {
        this._onDidChnageTreeData.fire();
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

    private parseTree(): GCodeTreeNode[] {

        this.text = '';
        let editor = vscode.window.activeTextEditor;

        if (editor && editor.document) {
            this.text = editor.document.getText();

            
            // TODO PARSE GCODE
        } else {
            return [];
        }

        return [];
    }

    getChildren(element?: GCodeTreeNode): Thenable<GCodeTreeNode[]> {
        return Promise.resolve([]);
    }

    getTreeItem(element: GCodeTreeNode): vscode.TreeItem {
        return element;
    }
}

export class GCodeTreeNode extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }

    // TOOL TIP
    get tooltip(): string {
        return "tooltip";
    }

    get description(): string {
        return "description";
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'gcode.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'gcoode.svg')
    };
}