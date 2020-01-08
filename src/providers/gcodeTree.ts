import * as vscode from 'vscode';
import * as path from 'path';

export class GCodeTreeProvider implements vscode.TreeDataProvider<GCodeTreeNode> {

    private _onDidChnageTreeData: vscode.EventEmitter<GCodeTreeNode | undefined> = new vscode.EventEmitter<GCodeTreeNode | undefined>();
    readonly onDidChangeTreeData: vscode.Event<GCodeTreeNode | undefined> = this._onDidChnageTreeData.event;

    private text: string = '';
    private tree: Array<GCodeTreeNode> = [];
    private autoRefresh: boolean = true;

    constructor(context: vscode.ExtensionContext) {
        
        vscode.window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
        

        this.onActiveEditorChanged();
    }

    refresh(): void {
        
        this.parseTree();

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

        console.log('Parsing Tree...');

        //this.text = '';
        this.tree = [];
        let editor = vscode.window.activeTextEditor;

        if (editor && editor.document) {
            this.text = editor.document.getText();

            // TODO PARSE GCODE

            this.tree.push(
                new GCodeTreeNode('test', vscode.TreeItemCollapsibleState.None)
            );
        } else {
            return [];
        }

        return [];
    }

    getChildren(element?: GCodeTreeNode): Thenable<GCodeTreeNode[]> {

        return Promise.resolve(this.tree);

        
    }

    getTreeItem(element: GCodeTreeNode): vscode.TreeItem {
        return element;
    }
}

export class GCodeTreeNode extends vscode.TreeItem {

    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
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