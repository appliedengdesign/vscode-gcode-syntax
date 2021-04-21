/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import { constants } from '../../util/constants';
import { TreeItemCollapsibleState } from 'vscode';
import { IconType, ResourceType, ViewNode } from './nodes';
import * as path from 'path';

export const enum StatsType {
    Root,
    ToolChanges,
    RunTime,
    Error,
    Info,
}

export class StatsNode extends ViewNode {
    private _children: ViewNode[] = [];

    constructor(
        private type: StatsType,
        private name: string,
        private desc?: string,
        private cValue?: ResourceType,
        private collapsible: TreeItemCollapsibleState = TreeItemCollapsibleState.None,
        private tTip?: string,
    ) {
        super(name, desc, ResourceType.Stats);

        this.setIcon();
    }

    setIcon(): void {
        switch (this.type) {
            case StatsType.ToolChanges:
                this.iconPath = {
                    light: path.join(constants.iconsPath, 'light', `${IconType.ToolChange}${constants.iconExt}`),
                    dark: path.join(constants.iconsPath, 'dark', `${IconType.ToolChange}${constants.iconExt}`),
                };
                break;

            case StatsType.RunTime:
                this.iconPath = {
                    light: path.join(constants.iconsPath, 'light', `${IconType.Dwell}${constants.iconExt}`),
                    dark: path.join(constants.iconsPath, 'dark', `${IconType.Dwell}${constants.iconExt}`),
                };
                break;
        }
    }

    getTreeItem(): ViewNode | Promise<ViewNode> {
        return this;
    }

    getChildren(): ViewNode[] {
        return this._children;
    }
}
