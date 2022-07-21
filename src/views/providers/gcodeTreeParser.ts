/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';
import { Range, TreeItemCollapsibleState } from 'vscode';
import { NavTreeNode } from '../nodes/navTreeNode';
import { IconType } from '../nodes/nodes';
import { stripComments } from './helpers';

export class GCodeTreeParser {
    private blocks: NavTreeNode[];

    constructor(readonly text: string) {
        this.blocks = this.getBlocks(text);
    }

    getTree(): NavTreeNode[] {
        return this.blocks;
    }

    // Split Text into Blocks by newline or ;
    private getBlocks(text: string): NavTreeNode[] {
        let nodes: NavTreeNode[] = [];
        const lines = text.match(/.*(?:\r\n|\r|\n)/g) || [];

        for (let i = 0; i < lines.length; ++i) {
            const line = lines[i].trim();

            if (line.length === 0) {
                continue;
            }

            const result = this.parseLine(line, i);
            if (result.length !== 0) {
                nodes = nodes.concat(result);
            }
        }

        return nodes;
    }

    // Parse Line for Blocks
    private parseLine(line: string, lnum: number): NavTreeNode[] {
        const blocks: NavTreeNode[] = [];
        let node: NavTreeNode;
        let x: number;
        let tmp: any;
        const len = line.length;

        // Regexp to Pull key words
        // eslint-disable-next-line
        const re = /((GOTO)|(IF)|(EQ)|(NE)|(LT)|(GT)|(LE)|(GE)|(DO)|(WHILE)|(END)|(AND)|(OR)|(XOR)|(SIN)|(COS)|(TAN)|(ASIN)|(ACOS)|(ATAN)|(FIX)|(FUP)|(LN)|(ROUND)|(SQRT)|(FIX)|(FUP)|(ROUND)|(ABS))|((?:\$\$)|(?:\$[a-zA-Z0-9#]*))|([a-zA-Z][0-9\+\-\.]+)|(\*[0-9]+)|([#][0-9]+)|([#][\[].+[\]])/igm;

        // Strip Comments
        line = stripComments(line);

        // Get Words
        const words = line.match(re) || [];

        for (let i = 0; i < words.length; ++i) {
            const word = words[i];
            const letter = word[0].toUpperCase();
            const argument = word.slice(1);

            // G-Code
            if (letter === 'G') {
                switch (argument) {
                    // Rapid Motion
                    case '00':
                    case '0':
                        node = new NavTreeNode('Rapid', TreeItemCollapsibleState.None);
                        node.tooltip = '[G00] Rapid Motion';
                        node.setIcon(IconType.Rapid);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Linear / Cutting
                    case '01':
                    case '1':
                        node = new NavTreeNode('Cutting', TreeItemCollapsibleState.None);
                        node.tooltip = '[G01] Linear Motion';
                        node.setIcon(IconType.Cutting);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // CW Motion
                    case '02':
                    case '2':
                        node = new NavTreeNode('CW Cutting', TreeItemCollapsibleState.None);
                        node.tooltip = '[G02] CW Interpolation';
                        node.setIcon(IconType.CWCutting);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // CCW Motion
                    case '03':
                    case '3':
                        node = new NavTreeNode('CCW Cutting', TreeItemCollapsibleState.None);
                        node.tooltip = '[G03] CCW Interpolation';
                        node.setIcon(IconType.CCWCutting);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Dwell
                    case '04':
                    case '4':
                        if (i === 0) {
                            x = 1;
                        } else {
                            x = -1;
                        }

                        if (!(tmp = words[i + x].slice(1)).match(/\./g)) {
                            // Milliseconds
                            tmp = Number(tmp) / 1000;
                        }

                        node = new NavTreeNode(`Dwell (${<number>tmp}s)`, TreeItemCollapsibleState.None);
                        node.tooltip = '[G04] Dwell';
                        node.setIcon(IconType.Dwell);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Engraving
                    case '47':
                        node = new NavTreeNode('Engraving', TreeItemCollapsibleState.None);
                        node.tooltip = '[G47] Engraving';
                        node.setIcon(IconType.Engraving);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Standard Work Offsets
                    case '54':
                    case '55':
                    case '56':
                    case '57':
                    case '58':
                    case '59':
                    case '110':
                    case '111':
                    case '112':
                    case '113':
                    case '114':
                    case '115':
                    case '116':
                    case '117':
                    case '118':
                    case '119':
                    case '120':
                    case '121':
                    case '122':
                    case '123':
                    case '124':
                    case '125':
                    case '126':
                    case '127':
                    case '128':
                    case '129':
                        node = new NavTreeNode(`${'Work Offset' + ' (G'}${argument})`, TreeItemCollapsibleState.None);
                        node.tooltip = `[G${argument}] Work Offset`;
                        node.setIcon(IconType.WorkOffset);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Extended Work Offsets
                    case '154':
                        node = new NavTreeNode(
                            `${'Work Offset' + ' (G154 '}${words[i + 1]})`,
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = `[G154 ${words[i + 1]}] Work Offset`;
                        node.setIcon(IconType.WorkOffset);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Extended Work Offsets
                    case '54.1':
                        node = new NavTreeNode(
                            `${'Work Offset' + ' (G54.1 '}${words[i + 1]})`,
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = `[G54.1 ${words[i + 1]}] Work Offset`;
                        node.setIcon(IconType.WorkOffset);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Okuma Work Offsets
                    case '15':
                        node = new NavTreeNode(
                            `${'Work Offset' + ' (G15 '}${words[i + 1]})`,
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = `[G15 ${words[i + 1]}] Work Offset`;
                        node.setIcon(IconType.WorkOffset);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // External Sub Program
                    case '65':
                        node = new NavTreeNode('Ext Subprogram', TreeItemCollapsibleState.None);
                        node.tooltip = '[G65] Ext Subprogram Call';
                        node.setIcon(IconType.ExtSubProgram);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // LH Tapping Cycle
                    case '74':
                        node = new NavTreeNode('LH Tapping Cycle', TreeItemCollapsibleState.None);
                        node.tooltip = '[G74] LH Tapping Cycle';
                        node.setIcon(IconType.TappingLH);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Drill Cycle
                    case '81':
                        node = new NavTreeNode('Drill Cycle', TreeItemCollapsibleState.None);
                        node.tooltip = '[G81] Drill Cycle';
                        node.setIcon(IconType.Drill);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Spot Drill Cycle
                    case '82':
                        node = new NavTreeNode('Spot Drill Cycle', TreeItemCollapsibleState.None);
                        node.tooltip = '[G82] Spot Drill Cycle';
                        node.setIcon(IconType.DrillDwell);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Peck Drill Cycle
                    case '83':
                        node = new NavTreeNode('Peck Drill Cycle', TreeItemCollapsibleState.None);
                        node.tooltip = '[G83] Peck Drill Cycle';
                        node.setIcon(IconType.DrillPeck);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // RH Tapping Cycle
                    case '84':
                        node = new NavTreeNode('RH Tapping Cycle', TreeItemCollapsibleState.None);
                        node.tooltip = '[G84] RH Tapping Cycle';
                        node.setIcon(IconType.TappingRH);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Boring Cycles
                    case '85':
                    case '86':
                    case '87':
                    case '88':
                    case '89':
                        node = new NavTreeNode('Boring Cycle', TreeItemCollapsibleState.None);
                        node.tooltip = `[G${argument}] Boring Cycle`;
                        node.setIcon(IconType.Boring);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // No Match
                    default: {
                        break;
                    }
                }
            } else if (letter === 'M') {
                switch (argument) {
                    // Tool Change
                    case '00':
                    case '01':
                        node = new NavTreeNode(
                            argument === '00' ? 'Program Stop' : 'Optional Stop',
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = argument === '00' ? 'Program Stop' : 'Optional Stop';
                        node.setIcon(IconType.Stop);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Spindle Clockwise
                    case '03':
                    case '3':
                        if (i === 0) {
                            x = 1;
                        } else {
                            x = -1;
                        }

                        node = new NavTreeNode(
                            `Spindle On ${words[i + x].slice(1) === undefined ? '' : words[i + x].slice(1)}RPM` + ' CW',
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = `Spindle On Clockwise (${
                            words[i + x].slice(1) === undefined ? '' : words[i + x].slice(1)
                        }RPM)`;
                        node.setIcon(IconType.SpindleCW);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Spindle CounterClockwise
                    case '04':
                    case '4':
                        if (i === 0) {
                            x = 1;
                        } else {
                            x = -1;
                        }
                        node = new NavTreeNode(
                            `Spindle On ${words[i + x].slice(1) === undefined ? '' : words[i + x].slice(1)}RPM` +
                                ' CCW',
                            TreeItemCollapsibleState.None,
                        );
                        node.tooltip = `Spindle On Counter Clockwise (${
                            words[i + x].slice(1) === undefined ? '' : words[i + x].slice(1)
                        }RPM)`;
                        node.setIcon(IconType.SpindleCCW);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Tool Change
                    case '06':
                    case '6':
                        node = new NavTreeNode('Tool Change', TreeItemCollapsibleState.None);
                        node.tooltip = 'Tool Change';
                        node.setIcon(IconType.ToolChange);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Coolant On
                    case '08':
                    case '8':
                    case '88':
                        node = new NavTreeNode('Coolant On', TreeItemCollapsibleState.None);
                        node.tooltip = 'Coolant Turned On';
                        node.setIcon(IconType.CoolantOn);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Coolant Off
                    case '09':
                    case '9':
                    case '89':
                        node = new NavTreeNode('Coolant Off', TreeItemCollapsibleState.None);
                        node.tooltip = 'Coolant Turned Off';
                        node.setIcon(IconType.CoolantOff);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Local Subprogram
                    case '97':
                        node = new NavTreeNode('Local Sub Call', TreeItemCollapsibleState.None);
                        node.tooltip = 'Local Subprogram Call';
                        node.setIcon(IconType.LocalSub);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    // Local Subprogram
                    case '99':
                        node = new NavTreeNode('Local Sub Return', TreeItemCollapsibleState.None);
                        node.tooltip = 'Local Subprogram Return';
                        node.setIcon(IconType.SubProgramReturn);
                        node.command = {
                            command: 'gcode.views.navTree.select',
                            title: '',
                            arguments: [new Range(lnum, 0, lnum, len)],
                        };

                        blocks.push(node);
                        break;

                    default:
                        break;
                }
            }
        }

        return blocks;
    }
}
