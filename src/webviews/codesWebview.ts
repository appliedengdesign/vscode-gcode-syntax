/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { ConfigurationChangeEvent, Webview } from 'vscode';
import { WebViewCommands } from './webviewCommands';
import { GWebView } from './webviews';

const GCodesWebviewInfo = {
    ViewId: 'gcode.webviews.codes',
    Title: 'G/M Code Reference',
};

class CodesWebview extends GWebView {
    constructor() {
        super(GCodesWebviewInfo.ViewId, GCodesWebviewInfo.Title, WebViewCommands.ShowCodesWebview);
    }

    onConfigurationChanged(e: ConfigurationChangeEvent) {
        return;
    }

    async getHtml(webview: Webview): Promise<string> {
        // DO SOMETHING
    }
}
