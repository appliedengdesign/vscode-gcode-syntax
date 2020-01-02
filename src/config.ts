import { WorkspaceConfiguration, workspace } from "vscode";

class Config {
    private config: WorkspaceConfiguration;

    constructor() {
        workspace.onDidChangeConfiguration((e) => this.reloadConfig());

        this.config = workspace.getConfiguration("gcode");
    }

    private reloadConfig() {
        this.config = workspace.getConfiguration("gcode");
    } 

}

export const config = new Config();