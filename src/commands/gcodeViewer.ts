/* eslint-disable max-len */
import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { GCode } from '../model';
import { FileSystemUtils, GCodeParser } from '.';

export class GCodeViewer {
    private static readonly _name: string = 'gcodeViewer';
    private extensionContext: vscode.ExtensionContext;
    private fsUtils = new FileSystemUtils();
    private gcode: GCode | undefined;

    public static get commandName(): string {
        return GCodeViewer._name;
    }

    constructor(context: vscode.ExtensionContext) {
        this.extensionContext = context;
    }

    public execute(webview: vscode.Webview): void {
        if (vscode.window.activeTextEditor !== undefined) {
            const doc = vscode.window.activeTextEditor.document;
            const extension = doc.fileName.substr(doc.fileName.lastIndexOf('.') + 1);
            if (['gcode', 'nc', 'mpt', 'mpf'].includes(extension)) {
                // Extensions mentioned in this article https://en.wikipedia.org/wiki/G-code
                const gcodeParser = new GCodeParser();
                this.gcode = gcodeParser.parseFile(doc.fileName);
                const outputJsFilename = `${GCodeViewer._name}.js`;
                const htmlContent = this.generateHtmlContent(webview, doc.fileName, outputJsFilename);
                this.fsUtils.writeFile(
                    this.extensionContext?.asAbsolutePath(path.join('.', 'gcodeViewer.html')),
                    htmlContent,
                    () => {
                        webview.html = htmlContent;
                    },
                );
            }
        }
    }

    private generateHtmlContent(webview: vscode.Webview, filename: string, outputJsFilename: string): string {
        const templateHtmlFilename = `${GCodeViewer._name}.html`;
        let htmlContent = fs.readFileSync(
            this.extensionContext?.asAbsolutePath(path.join('templates', templateHtmlFilename)),
            'utf8',
        );

        const cssPath = vscode.Uri.joinPath(
            this.extensionContext.extensionUri,
            'stylesheets',
            `${GCodeViewer._name}.css`,
        );
        const cssUri = webview.asWebviewUri(cssPath);
        htmlContent = htmlContent.replace(`${GCodeViewer._name}.css`, cssUri.toString());

        const nonce = this.getNonce();
        htmlContent = htmlContent.replace('nonce-nonce', `nonce-${nonce}`);
        htmlContent = htmlContent.replace(/<script /g, `<script nonce="${nonce}" `);
        htmlContent = htmlContent.replace('cspSource', webview.cspSource);

        const svg = this.gcode?.toSvg();
        if (svg !== undefined) {
            htmlContent = htmlContent.replace(
                '<svg></svg>',
                svg.replace('<?xml version="1.0" encoding="UTF-8" standalone="no"?>', ''),
            );
        }

        const jsPath = vscode.Uri.joinPath(this.extensionContext.extensionUri, outputJsFilename);
        const jsUri = webview.asWebviewUri(jsPath);
        htmlContent = htmlContent.replace(`${GCodeViewer._name}.js`, jsUri.toString());
        return htmlContent;
    }

    private getNonce() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
