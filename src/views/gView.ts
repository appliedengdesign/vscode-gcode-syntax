/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import {
    commands,
    ConfigurationChangeEvent,
    Disposable,
    Event,
    EventEmitter,
    TextDocumentChangeEvent,
    TextEditor,
    TreeDataProvider,
    TreeItem,
    TreeView,
    TreeViewVisibilityChangeEvent,
    window,
    workspace,
} from 'vscode';
import { configuration } from '../util/configuration/config';
import { Logger } from '../util/logger';
import { NodeTypes, ViewNode } from './nodes/nodes';

export abstract class GView<TRoot extends ViewNode<NodeTypes>> implements TreeDataProvider<ViewNode>, Disposable {
    protected _disposables: Disposable[] = [];
    protected _root: TRoot | undefined;
    protected _tree: TreeView<ViewNode> | undefined;
    protected _editor: TextEditor | undefined;
    protected _autoRefresh: boolean | undefined;

    protected _onDidChangeTreeData: EventEmitter<ViewNode | undefined> = new EventEmitter<ViewNode | undefined>();
    get onDidChangeTreeData(): Event<ViewNode | undefined> {
        return this._onDidChangeTreeData.event;
    }

    private _onDidChangeVisibility: EventEmitter<TreeViewVisibilityChangeEvent> =
        new EventEmitter<TreeViewVisibilityChangeEvent>();
    get onDidChangeVisibility(): Event<TreeViewVisibilityChangeEvent> {
        return this._onDidChangeVisibility.event;
    }

    protected abstract getRoot(): ViewNode | undefined;

    constructor(public readonly id: string, public readonly name: string) {
        this._disposables.push(...this.registerCommands());
    }

    protected ensureRoot() {
        if (this._root === undefined) {
            this.getRoot();
        }

        return this._root;
    }

    protected initialize(options: { showCollapseAll?: boolean } = {}) {
        this._tree = window.createTreeView(this.id, {
            ...options,
            treeDataProvider: this,
        });

        this._disposables.push(
            configuration.onDidChange(this.onConfigurationChanged, this),
            window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged()),
            workspace.onDidChangeTextDocument(e => this.onDocumentChanged(e)),
            this._tree,
            this._tree.onDidChangeVisibility(this.onVisibilityChanged, this),
        );
    }

    protected onVisibilityChanged(e: TreeViewVisibilityChangeEvent) {
        this._onDidChangeVisibility.fire(e);
    }

    get visible(): boolean {
        return this._tree?.visible ?? false;
    }

    protected async show(options?: { preserveFocus?: boolean }) {
        if (!this.visible) {
            try {
                void (await commands.executeCommand(`${this.id}.focus`, options));
            } catch (err) {
                Logger.error(err, 'Error focusing view');
            }
        }
    }

    dispose() {
        Disposable.from(...this._disposables).dispose();
    }

    getTreeItem(element: ViewNode): TreeItem | Promise<TreeItem> {
        return element;
    }

    getChildren(element?: ViewNode): ViewNode[] | Promise<ViewNode[]> | undefined {
        if (element) {
            return element.getChildren();
        } else {
            const root = this.ensureRoot();
            return root?.getChildren();
        }
    }

    getParent(element: ViewNode): ViewNode | undefined {
        return element.getParent();
    }

    protected abstract registerCommands(): Disposable[];

    protected abstract refresh(element?: ViewNode): void;

    protected abstract onConfigurationChanged(e: ConfigurationChangeEvent): void;

    protected abstract onActiveEditorChanged(): void;

    protected abstract onDocumentChanged(changeEvent: TextDocumentChangeEvent): void;
}
