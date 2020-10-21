/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { constants } from '../../util/constants';
import * as path from 'path';


export class GCodeTreeNode extends TreeItem {

    constructor(
        public readonly label: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
    }

    setIcon(type: string): void {

        switch (type) {
            case "toolchange":
            case "rapid":    
            case "cutting":
            case "cwcutting":
            case "ccwcutting":
            case "coolanton":
            case "coolantoff":
            case "extsubprog":
            case "localsubprog":
            case "subprogreturn":
            case "workoffset":
            case "spindlecw":
            case "spindleccw":
                this.iconPath = {
                    light: path.join(constants.iconsPath, 'light', type+'.svg'),
                    dark: path.join(constants.iconsPath, 'dark', type+'.svg')
                };
                break;

            default:
                this.iconPath = {
                    light: path.join(constants.iconsPath, 'light', 'gcode.svg'),
                    dark: path.join(constants.iconsPath, 'dark', 'gcode.svg')
                };
        }

    }

}