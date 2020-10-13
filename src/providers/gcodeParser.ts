import * as vscode from 'vscode';
import {GCodeTreeNode} from './gcodeTree';

export class GCodeParser {

    private blocks: Array<GCodeTreeNode>;

    constructor( readonly text: string) {
    
        this.blocks = this.getBlocks(text);

    }

    getTree(): Array<GCodeTreeNode> {
        return this.blocks;
    }

    // Split Text into Blocks by newline or ;
    private getBlocks(text: string): Array<any> {

        const nodes:Array<any> = [];
        const lines = text.match(/.*(?:\r\n|\r|\n)/g) || [];

        for (let i = 0; i < lines.length; ++i) {
            
            const line = lines[i].trim();
            
            if (line.length === 0) {
                continue;
            }

            const result = this.parseLine(line, i);
            if (result.length !== 0) {
                nodes.push(result);
            }
        }
        
        return nodes;

    }

    // Parse Line for Blocks
    private parseLine(line: string, lnum:number): Array<GCodeTreeNode> {

        const blocks: Array<GCodeTreeNode> = [];
        let node: GCodeTreeNode;
        const len = line.length;
        
        // Regexp to Pull key words
        // eslint-disable-next-line
        const re = /((GOTO)|(IF)|(EQ)|(NE)|(LT)|(GT)|(LE)|(GE)|(DO)|(WHILE)|(END)|(AND)|(OR)|(XOR)|(SIN)|(COS)|(TAN)|(ASIN)|(ACOS)|(ATAN)|(FIX)|(FUP)|(LN)|(ROUND)|(SQRT)|(FIX)|(FUP)|(ROUND)|(ABS))|((?:\$\$)|(?:\$[a-zA-Z0-9#]*))|([a-zA-Z][0-9\+\-\.]+)|(\*[0-9]+)|([#][0-9]+)|([#][\[].+[\]])/igm;
       
        // Strip Comments
        line = this.stripComments(line);

        // Get Words
        const words = line.match(re) || [];

        for (let i = 0; i < words.length; ++i) {
            const word = words[i];
            const letter = word[0].toUpperCase();
            const argument = word.slice(1);

            // G-Code
            if (letter === 'G') {

                switch(argument) {

                    // Rapid Motion
                    case '00':
                    case '0' : 
                       node = new GCodeTreeNode(
                            'Rapid', 
                            vscode.TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G00] Rapid Motion';
                        node.setIcon('rapid');
                        node.command = {
                            command: 'extension.gcodeSelection',
                            title: "",
                            arguments: [new vscode.Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;

                    // Linear / Cutting
                    case '01':
                    case '1' : 
                        node = new GCodeTreeNode(
                            'Cutting', 
                            vscode.TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G01] Linear]';
                        node.setIcon('cutting');
                        node.command = {
                            command: 'extension.gcodeSelection',
                            title: "",
                            arguments: [new vscode.Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;

                    // CW Motion
                    case '02':
                    case '2' : 
                        node = new GCodeTreeNode(
                            'CW Cutting', 
                            vscode.TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G02] CW Interpolation';
                        node.setIcon('cwcutting');
                        node.command = {
                            command: 'extension.gcodeSelection',
                            title: "",
                            arguments: [new vscode.Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;

                    // CCW Motion
                    case '03':
                    case '3' :
                        node = new GCodeTreeNode(
                            'CCW Cutting', 
                            vscode.TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G03] CCW Interpolation';
                        node.setIcon('ccwcutting');
                        node.command = {
                            command: 'extension.gcodeSelection',
                            title: "",
                            arguments: [new vscode.Range(lnum, 0, lnum, len)]
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
                        node = new GCodeTreeNode(
                            'Work Offset' + ' (G' + argument + ')', 
                            vscode.TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G' + argument + '] Work Offset';
                        node.setIcon('workoffset');
                        node.command = {
                            command: 'extension.gcodeSelection',
                            title: "",
                            arguments: [new vscode.Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;
                    
                    // Extended Work Offsets
                    case '154':
                        node = new GCodeTreeNode(
                            'Work Offset' + ' (G154 ' + words[i + 1] + ')',
                            vscode.TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G154 ' + words[i + 1] + '] Work Offset';
                        node.setIcon('workoffset');
                        node.command = {
                            command: 'extension.gcodeSelection',
                            title: "",
                            arguments: [new vscode.Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;

                    // Extended Work Offsets
                    case '54.1':
                        node = new GCodeTreeNode(
                            'Work Offset' + ' (G54.1 ' + words[i + 1] + ')',
                            vscode.TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G54.1 ' + words[i + 1] + '] Work Offset';
                        node.setIcon('workoffset');
                        node.command = {
                            command: 'extension.gcodeSelection',
                            title: "",
                            arguments: [new vscode.Range(lnum, 0, lnum, len)]
                        };
    
                        blocks.push(node);
                        break;
                    
                    // Okuma Work Offsets
                    case '15':
                        node = new GCodeTreeNode(
                            'Work Offset' + ' (G15 ' + words[i + 1] + ')',
                            vscode.TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G15 ' + words[i + 1] + '] Work Offset';
                        node.setIcon('workoffset');
                        node.command = {
                            command: 'extension.gcodeSelection',
                            title: "",
                            arguments: [new vscode.Range(lnum, 0, lnum, len)]
                        };
    
                        blocks.push(node);
                        break;
                    
                    // External Sub Program
                    case '65':
                        node = new GCodeTreeNode(
                            'Ext Subprogram', 
                            vscode.TreeItemCollapsibleState.None,
                        );
                        node.tooltip = '[G65] Ext Subprogram Call';
                        node.setIcon('extsubprog');
                        node.command = {
                            command: 'extension.gcodeSelection',
                            title: "",
                            arguments: [new vscode.Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;

                    default: {
                        break;
                    }
                }

            } else if (letter === 'M') {

                switch(argument) {

                    // Tool Change
                    case '06':
                    case '6' :
                        node = new GCodeTreeNode(
                            'Tool Change', 
                            vscode.TreeItemCollapsibleState.None,
                        );
                        node.tooltip = 'Tool Change';
                        node.setIcon('toolchange');
                        node.command = {
                            command: 'extension.gcodeSelection',
                            title: "",
                            arguments: [new vscode.Range(lnum, 0, lnum, len)]
                        };

                        blocks.push(node);
                        break;
                    
                    
                    // Coolant On
                    case '08':
                    case '8' :
                        node = new GCodeTreeNode(
                            'Coolant On', 
                            vscode.TreeItemCollapsibleState.None,
                        );
                        node.tooltip = 'Coolant Turned On';
                        node.setIcon('coolanton');
                        node.command = {
                            command: 'extension.gcodeSelection',
                            title: "",
                            arguments: [new vscode.Range(lnum, 0, lnum, len)]
                        };
                        
                        blocks.push(node);
                        break;

                    // Coolant Off
                    case '09':
                    case '9' : 
                        node = new GCodeTreeNode(
                            'Coolant Off', 
                            vscode.TreeItemCollapsibleState.None,
                        );
                        node.tooltip = 'Coolant Turned Off';
                        node.setIcon('coolantoff');
                        node.command = {
                            command: 'extension.gcodeSelection',
                            title: "",
                            arguments: [new vscode.Range(lnum, 0, lnum, len)]
                        };
                        
                        blocks.push(node);
                        break;
                    
                    // Local Subprogram
                    case '97':
                        node = new GCodeTreeNode(
                            'Local Sub Call', 
                            vscode.TreeItemCollapsibleState.None,
                        );
                        node.tooltip = 'Local Subprogram Call';
                        node.setIcon('localsubprog');
                        node.command = {
                            command: 'extension.gcodeSelection',
                            title: "",
                            arguments: [new vscode.Range(lnum, 0, lnum, len)]
                        };
                        
                        blocks.push(node);
                        break;

                    // Local Subprogram
                    case '99':
                        node = new GCodeTreeNode(
                            'Local Sub Return', 
                            vscode.TreeItemCollapsibleState.None,
                        );
                        node.tooltip = 'Local Subprogram Return';
                        node.setIcon('subprogreturn');
                        node.command = {
                            command: 'extension.gcodeSelection',
                            title: "",
                            arguments: [new vscode.Range(lnum, 0, lnum, len)]
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

    // Comments
    private stripComments(line: string): string {
        // eslint-disable-next-line
        const re1 = new RegExp(/\s*\([^\)]*\)/g);   // Remove anything inside the parentheses
        const re2 = new RegExp(/\s*;.*/g);          // Remove anything after a semi-colon to the end of the line, including preceding spaces
        const re3 = new RegExp(/\s+/g);
        
        return (line.replace(re1, '').replace(re2, '').replace(re3, ''));
    }




}