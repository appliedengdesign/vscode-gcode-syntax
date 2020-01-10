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

        let blocks: Array<GCodeTreeNode> = [];
        let node: GCodeTreeNode;
        let len = line.length;
        
        // Regexp to Pull key words
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

                    default:
                        break;
                }
            }
        }

        return blocks;

        
    }

    // Comments
    private stripComments(line: string): string {
        const re1 = new RegExp(/\s*\([^\)]*\)/g);   // Remove anything inside the parentheses
        const re2 = new RegExp(/\s*;.*/g);          // Remove anything after a semi-colon to the end of the line, including preceding spaces
        const re3 = new RegExp(/\s+/g);
        
        return (line.replace(re1, '').replace(re2, '').replace(re3, ''));
    }




}