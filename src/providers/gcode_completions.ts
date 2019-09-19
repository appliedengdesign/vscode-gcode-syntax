// Rerieve/Load Snippets based on configuration settings

import * as path from "path";
import * as vscode from "vscode";
import  { config } from "../config";


export class GcodeCompletionItemProvider implements vscode.CompletionItemProvider {
    private completions = new vscode.CompletionList();

    constructor(filename: string) {
        const snippets = require(path.join("../..", filename));

        for (const snippetType of Object.keys(snippets)) {
            for (const snippetName of Object.keys(snippets[snippetType])) {
                const snippet = snippets[snippetType][snippetName];
                const completionItem = new vscode.CompletionItem(snippetName, CompletionItemKind.Snippet);
                completionItem.filterText = snippet.prefix;
                completionItem.insertText = new vscode.SnippetString(
                    isArray(snippet.body)
                        ? snippet.body.join("\n")
                        : snippet.body,
                );

                completionItem.detail = snippet.description;
                completionItem.documentation = new vscode.MarkdownString().appendCodeblock(completionItem.insertText.value);
                this.completions.items.push(completionItem);
            }
        }
    }

    public provideCompletionItems(
        document: vscode.TextDocument, position: Position, token: vscode.CancellationToken,
    ): vscode.CompletionList {
        return this.completions;
    }
}

