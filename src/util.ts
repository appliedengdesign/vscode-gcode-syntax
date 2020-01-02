
import { workspace, WorkspaceConfiguration } from 'vscode';


const getConfig = (): WorkspaceConfiguration => {
    return workspace.getConfiguration('gcode');
};


export { 
    getConfig
};