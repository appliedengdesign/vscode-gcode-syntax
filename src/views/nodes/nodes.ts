/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { 
    Command,
    CommentThread,
    ThemeIcon, 
    TreeItem, 
    TreeItemCollapsibleState, 
    Uri 
} from "vscode";
import { StatsNode } from "./statsNode";
import { NavTreeNode } from "./navTreeNode";

export enum ResourceType {
    Stats = 'gcode:stats',
    Tree = 'gcode:tree'
}

export const enum IconType {
    TOOLCHANGE = "toolchange",
    RAPID = "rapid",
    CUTTING = "cutting",
    CWCUTTING = "cwcutting",
    CCWCUTTING = "ccwcutting",
    COOLANTON = "coolanton",
    COOLANTOFF = "coolantoff",
    EXTSUBPROG = "extsubprog",
    LOCALSUB = "localsubprog",
    SUBPROGRET = "subprogreturn",
    WORKOFFSET = "workoffset",
    SPINDLECW = "spindlecw",
    SPINDLECCW = "spindleccw"
}

export interface Node {
    setIcon(icon: IconType | undefined): void;
    getChildren(): ViewNode[] | Promise<ViewNode[]>;
    getTreeItem(): TreeItem | Promise<TreeItem>;
    getCommand(): Command | undefined;
    refresh?(): void | boolean | Promise<void> | Promise<boolean>;
}

export type NodeTypes = NavTreeNode | StatsNode;

export abstract class ViewNode<NType extends NodeTypes = NodeTypes> extends TreeItem  implements Node {

    constructor(
        private  _name: string,
        private  _description?: string,
        private  _contextValue?: ResourceType,
        private  _collapsible?: TreeItemCollapsibleState,
        private  _tooltip?: string,
        private  _iconPath?:
            | string
            | Uri
            | {
                    light: string | Uri;
                    dark: string | Uri;
            }
            | ThemeIcon,
        protected readonly parent?: ViewNode
    ) {
        super(_name);

        if (_description !== undefined) this.description = _description;

        if (_contextValue !== undefined) this.contextValue = _contextValue;

        if (_collapsible !== undefined) this.collapsibleState = _collapsible;

        if (_tooltip !== undefined) this.tooltip = _tooltip;

        if (_iconPath !== undefined) this.iconPath = _iconPath;
    }

    abstract setIcon(icon: IconType | undefined): void
    
    getChildren(): ViewNode[] | Promise<ViewNode[]> {
        return [];
    }

    getParent(): ViewNode | undefined {
        return this.parent;
    }

    abstract getTreeItem(): ViewNode | Promise<ViewNode>

    getCommand(): Command | undefined {
        return undefined;
    }

    refresh?(): void | boolean | Promise<void> | Promise<boolean>;

    update?(
        changes: {
            name?: string,
            desc?: string,
            tooltip?: string,
            iconPath?:
                | string
                | Uri
                | {
                    light: string | Uri;
                    dark: string | Uri;
                }
                | ThemeIcon;
        },
    ) {
        if (changes.name !== undefined) this._name = changes.name;

        if (changes.desc !== undefined) this._description = changes.desc;

        if (changes.tooltip !== undefined) this._tooltip = changes.tooltip;

        if (changes.iconPath !== undefined) this._iconPath = changes.iconPath;


    }
}

