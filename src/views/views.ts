/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { 
    ConfigurationChangeEvent, 
    Disposable, 
    Event, 
    EventEmitter, 
    TextDocumentChangeEvent, 
    TextEditor, 
    TreeDataProvider, 
    TreeItem, 
    TreeItemCollapsibleState, 
    TreeView, 
    TreeViewExpansionEvent, 
    TreeViewVisibilityChangeEvent, 
    window,
    workspace
} from "vscode";
import { Control } from "../control";
import { configuration } from "../util/config";
import { NodeTypes, ViewNode } from "./nodes/nodes";

export abstract class GView<TRoot extends ViewNode<NodeTypes>> implements TreeDataProvider<ViewNode>, Disposable {

    protected _disposable: Disposable | undefined;
    protected _root: TRoot | undefined;
    protected _tree: TreeView<ViewNode> | undefined;
    protected _editor: TextEditor | undefined;
    protected _autoRefresh: boolean | undefined;

    protected _onDidChangeTreeData: EventEmitter<ViewNode | undefined> = new EventEmitter<ViewNode | undefined>();
    readonly onDidChangeTreeData: Event<ViewNode | undefined> = this._onDidChangeTreeData.event;


    protected abstract getRoot(): ViewNode | undefined;

    constructor(public readonly id: string, public readonly name: string) {}

    protected ensureRoot() {
        if (this._root === undefined) this.getRoot();

        return this._root;
    }

    protected initialize(options: { showCollapseAll?: boolean } = {}) {
        if (this._disposable) {
            this._disposable.dispose();
            this._onDidChangeTreeData = new EventEmitter<ViewNode>();
        }

        this._tree = window.createTreeView(
            this.id,
            {
                ...options,
                treeDataProvider: this
            }
        );

        Control.context.subscriptions.push(configuration.onDidChange(this.onConfigurationChanged, this));

        window.onDidChangeActiveTextEditor(e => this.onActiveEditorChanged(e));
        workspace.onDidChangeTextDocument(e => this.onDocumentChanged(e));

        this._disposable = Disposable.from(
            this._tree
        );

    }

    dispose() {
        this._disposable && this._disposable.dispose();
    }


    getTreeItem(element: ViewNode): TreeItem | Promise<TreeItem> {
        return element;
    }

    getChildren(element?: ViewNode): ViewNode[] | Promise<ViewNode[]> | undefined {

        const root = this.ensureRoot();
        return root?.getChildren();
    }

    getParent(element: ViewNode): ViewNode | undefined {
        return element.getParent();
    }

    protected abstract async refresh(element?: ViewNode): Promise<void> 

    getQualifiedCommand(cmd: string) {
        return `${this.id}.${cmd}`;
    }

    protected abstract onDocumentChanged(changeEvent: TextDocumentChangeEvent): void 

    protected abstract onActiveEditorChanged(editor: TextEditor | undefined): void

    protected abstract onConfigurationChanged(e: ConfigurationChangeEvent): void
}