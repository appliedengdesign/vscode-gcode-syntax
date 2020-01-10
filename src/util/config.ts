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

    getParam(param: string): any {

        return this.config.get(param);
    }

}

export const config = new Config();