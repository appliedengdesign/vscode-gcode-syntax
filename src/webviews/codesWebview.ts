/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { ConfigurationChangeEvent, Uri, Webview, workspace } from 'vscode';
import { Control } from '../control';
import { WebViewCommands } from './webviewCommands';
import { GWebView } from './webviews';

const GCodesWebviewInfo = {
    ViewId: 'gcode.webviews.codes',
    Title: 'G/M Code Reference',
};

export class CodesWebview extends GWebView {
    constructor() {
        super(GCodesWebviewInfo.ViewId, GCodesWebviewInfo.Title, WebViewCommands.ShowCodesWebview);
    }

    onConfigurationChanged(e: ConfigurationChangeEvent) {
        return;
    }

    async getHtml(webview: Webview): Promise<string> {
        // DO SOMETHING
        const jsonUri = Uri.joinPath(Control.context.extensionUri, 'resources', 'reference', 'milling', 'gcodes.json');

        return Promise.resolve(
            await workspace.fs.readFile(jsonUri).then(value => {
                return value.toString();
            }),
        );
    }
}
