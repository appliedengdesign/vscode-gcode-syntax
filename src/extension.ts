import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    
    // Get Configuration
    let gcodeConf = vscode.workspace.getConfiguration();

    console.log('gcode.colorization:' + gcodeConf.get('gcode.colorization'));

    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {

            if (e.affectsConfiguration('gcode.colorization')) {
             
                let tokenColors = vscode.workspace.getConfiguration('editor.tokenColorCustomizations');

                console.log(tokenColors.textMateRules);
                
                if (vscode.workspace.getConfiguration().get('gcode.colorization')) {
                    console.log('toggle on');
                } else {
                    console.log('toggle off');
                }
            }

    }));
}