/* eslint linebreak-style: ["error", "windows"]*/

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class FileSystemUtils {
    public listFiles(
        dir: string,
        excludeDirectories: string[],
        isMatchingFile: (filename: string) => boolean,
    ): string[] {
        const directories = this.listDirectories(dir, excludeDirectories);
        directories.push(dir);
        let files: string[] = [];
        directories.forEach(directory => {
            const filesInDirectory = fs
                .readdirSync(directory)
                .map(name => path.join(directory, name))
                .filter((name: any) => fs.lstatSync(name).isFile())
                .filter((name: string) => isMatchingFile(name));
            files = files.concat(filesInDirectory);
        });
        return files;
    }

    public fileExists(filename: string): boolean {
        try {
            return fs.lstatSync(filename).isFile();
        } catch {
            return false;
        }
    }
    private isDirectory(directoryName: any): boolean {
        return fs.lstatSync(directoryName).isDirectory();
    }

    public listDirectories(dir: string, excludeDirectories: string[]): string[] {
        if (excludeDirectories.includes(path.basename(dir))) {
            return [];
        }
        const directories = fs
            .readdirSync(dir)
            .map(name => path.join(dir, name))
            .filter(this.isDirectory);
        let result: string[] = [];
        if (directories && directories.length > 0) {
            directories.forEach(directory => {
                if (!excludeDirectories.includes(path.basename(directory))) {
                    result.push(directory);
                    const subDirectories = this.listDirectories(directory, excludeDirectories);
                    if (subDirectories.length > 0) {
                        result = result.concat(
                            subDirectories.filter(element => {
                                return !excludeDirectories.includes(path.basename(element));
                            }),
                        );
                    }
                }
            });
        }
        return result;
    }

    public getWorkspaceFolder(): string {
        const folder = vscode.workspace.workspaceFolders;
        let directoryPath = '';
        if (folder !== null && folder !== undefined) {
            directoryPath = folder[0].uri.fsPath;
        }
        return directoryPath;
    }

    public writeFile(filename: string, content: string | Uint8Array, callback: () => void) {
        fs.writeFile(filename, content, err => {
            if (err) {
                return console.error(err);
            }
            callback();
        });
    }
}
