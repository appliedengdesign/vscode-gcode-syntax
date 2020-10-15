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
    TextDocumentChangeEvent,
    TextEditor,
    TreeDataProvider,
    TreeItem,
    TreeItemCollapsibleState,
    window,
    workspace 
} from 'vscode';
import { configuration } from '../util/config';


export class GCodeStatsProvider implements TreeDataProvider<GCodeStatsNode> {

    private _onDidChangeTreeData: EventEmitter<GCodeStatsNode | undefined> = new EventEmitter<GCodeStatsNode | undefined>();
    readonly onDidChangeTreeData: Event<GCodeStatsNode | undefined> = this._onDidChangeTreeData.event;

    private text = '';
    private tree: Array<GCodeStatsNode>;
    private editor: TextEditor | undefined;
    private autoRefresh = false;

    constructor(private context: ExtensionContext) {

        this.tree = [];
        this.editor = window.activeTextEditor;
        window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
        workspace.onDidChangeTextDocument(e => this.onDocumentChanged(e));

        this.autoRefresh = configuration.getParam('stats.autoRefresh');

    }

    refresh(): void {
        
        this.parseTree();

        this._onDidChangeTreeData.fire(undefined);
    }

    private onActiveEditorChanged(): void {
        if (window.activeTextEditor) {
            if (window.activeTextEditor.document.uri.scheme === 'file') {
                const enabled = window.activeTextEditor.document.languageId === 'gcode';
                commands.executeCommand('setContext', 'gcodeStatsViewEnabled', enabled);

                if (enabled) {
                    this.editor = window.activeTextEditor;
                    this.autoRefresh = configuration.getParam('stats.autoRefresh');
                    if (this.autoRefresh) this.refresh();
                }
            }
        } else {
            commands.executeCommand('setContext', 'gcodeStatsViewEnabled', false);
            this.refresh();
        }
    }

    private onDocumentChanged(changeEvent: TextDocumentChangeEvent): void {
        if (window.activeTextEditor) {
            if (window.activeTextEditor.document.uri.scheme === 'file') {
                const enabled = window.activeTextEditor.document.languageId === 'gcode';
                commands.executeCommand('setContext', 'gcodeStatsViewEnabled', enabled);

                if (enabled) {
                    this.editor = window.activeTextEditor;
                    this.autoRefresh = configuration.getParam('stats.autoRefresh');
                    if(this.autoRefresh) this.refresh();
                }
            }
        } else {
            commands.executeCommand('setContext', 'gcodeStatsViewEnabled', false);
            this.refresh();
        }
    }

    getTreeItem(element: any): TreeItem {
        return element;
    }

    getChildren(element?: GCodeStatsNode): Thenable<GCodeStatsNode[]> {

        return Promise.resolve(this.parseTree());

        
    }

    private parseTree(): GCodeStatsNode[] {

        this.text = '';
        this.tree = [];
        const editor = window.activeTextEditor;

        if (editor && editor.document) {
            this.text = editor.document.getText();

            return this.genStats(this.text);
        } else {
            
            return [];
        }

        return[];
    }

    private genStats(text: string): Array<GCodeStatsNode> {

        const stats: Array<GCodeStatsNode> = []; 
        
        // Tool Changes
        stats.push(this.getToolChanges(text));



        return stats;
    }

    private getToolChanges(text: string):GCodeStatsNode {
        const re = /(M0?6)/igm;
        const num = text.match(re)?.length || 0;

        const node: GCodeStatsNode = new GCodeStatsNode(
            'Tool Changes: ' + num,
            TreeItemCollapsibleState.None,
        );

        return node;
    }
}

export class GCodeStatsNode extends TreeItem {

    constructor(
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
    ) {
        super (label, collapsibleState);
    }

}