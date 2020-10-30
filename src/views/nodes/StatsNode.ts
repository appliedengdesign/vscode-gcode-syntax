/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { constants } from "../../util/constants";
import { TreeItemCollapsibleState } from "vscode";
import { IconType, ResourceType, ViewNode } from "./nodes";
import * as path from 'path';


export enum StatsType {
    ROOT,
    TOOLCHANGES
}

export class StatsNode extends ViewNode {


    constructor(
        private type: StatsType,
        private name: string,
        private desc?: string,
        private cValue?: ResourceType,
        private collapsible: TreeItemCollapsibleState = TreeItemCollapsibleState.None,
        private tTip?: string,
     ) {
        super(
            name,
            desc,
            ResourceType.Stats
        );
    }

    setIcon(): void {

        switch(this.type) {

            case StatsType.TOOLCHANGES:
                this.iconPath = {
                    light: path.join(constants.iconsPath, 'light', IconType.TOOLCHANGE + constants.iconExt),
                    dark: path.join(constants.iconsPath, 'dark', IconType.TOOLCHANGE + constants.iconExt)
                };
        }
    }

    getTreeItem(): ViewNode | Promise<ViewNode> {
        return this;
    }
  
}