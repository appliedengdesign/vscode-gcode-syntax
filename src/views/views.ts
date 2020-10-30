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
    TreeDataProvider, 
    TreeItem, 
    TreeItemCollapsibleState, 
    TreeView, 
    TreeViewExpansionEvent, 
    TreeViewVisibilityChangeEvent, 
    window
} from "vscode";
import { GCodeStatsView } from "./gcodeStatsView";
import { GCodeTreeView } from "./gcodeTreeView";
import { ViewNode } from "./nodes/nodes";

export abstract class GView<ViewNode> implements TreeDataProvider<ViewNode>, Disposable {

    protected _disposable: Disposable | undefined;
    protected _root: ViewNode | ViewNode[] | undefined;
    protected _tree: TreeView<ViewNode> | undefined;

    protected _onDidChangeTreeData: EventEmitter<ViewNode | undefined> = new EventEmitter<ViewNode | undefined>();
    readonly onDidChangeTreeData: Event<ViewNode | undefined> = this._onDidChangeTreeData.event;

    protected abstract getRoot(): ViewNode;

    constructor(public readonly id: string, public readonly name: string) {
        this.initialize();
    }

    protected ensureRoot() {
        if (this._root === undefined) this.getRoot();

        return this._root;
    }

    protected initialize(options: { showCollapseAll?: boolean } = {}) {
        if (this._disposable) {
            this._disposable.dispose();
            
        }

        this._tree = window.createTreeView(
            this.id,
            {
                ...options,
                treeDataProvider: this
        });

        this._disposable = Disposable.from(
            this._tree
        );
    }


    getTreeItem(element: ViewNode): TreeItem | Promise<TreeItem> {
        return element;
    }

    getChildren(element?: <ViewNode>): ViewNode[] | Promise<ViewNode[]> | undefined {

        if (element !== undefined) {
            if (element.hasChildren())
        }

        if (this._root === undefined) {
            this.getRoot();
            return this._root?.getChildren();
        }
        
    }

    dispose() {
        this._disposable && this._disposable.dispose();
    }

    async refresh(element?: ViewNode): Promise<void> {
        if (this._root !== undefined && this._root.refresh !== undefined) {
            await this._root.refresh();
        }

        return Promise.resolve(this._onDidChangeTreeData.fire(undefined));
    }

    getQualifiedCommand(cmd: string) {
        return `${this.id}.${cmd}`;
    }
}