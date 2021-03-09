/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { env, MessageItem, Uri, window } from 'vscode';
import { constants } from './constants';
import { Version } from './version';

export class Messages {
    static async showSupportGCodeMessage() {
        const actions: MessageItem[] = [
            { title: 'Leave a Review' },
            { title: 'Become a Sponsor' },
            { title: 'Subscribe to our YouTube' },
        ];

        const result = await Messages.showMessage(
            'info',
            'G-Code Syntax is offered to everyone for free. If you find it useful, please consider' +
                '[supporting](https://github.com/sponsors/appliedengdesign) it. Thank you! ❤',
            ...actions,
        );

        if (result != null) {
            if (result === actions[0]) {
                await env.openExternal(Uri.parse(constants.urls.vsmpReviews));
            } else if (result === actions[1]) {
                await env.openExternal(Uri.parse('https://github.com/sponsors/appliedengdesign'));
            } else if (result === actions[2]) {
                await env.openExternal(Uri.parse('https://youtube.com/c/AppliedEngDesignUSA'));
            }
        }
    }

    static async showWhatsNewMessage(ver: Version) {
        const actions: MessageItem[] = [{ title: "What's New" }, { title: '❤' }];

        const result = await Messages.showMessage(
            'info',
            `G-Code Syntax has been updated to v${ver.getVersionAsString()} - Check out what's new!`,
            ...actions,
        );

        if (result != null) {
            if (result === actions[0]) {
                await env.openExternal(Uri.parse(constants.urls.changeLog));
            } else if (result === actions[1]) {
                await env.openExternal(Uri.parse('https://github.com/sponsors/appliedengdesign'));
            }
        }
    }

    private static async showMessage(
        type: 'info' | 'warn' | 'error',
        msg: string,
        ...actions: MessageItem[]
    ): Promise<MessageItem | undefined> {
        let result: MessageItem | undefined = undefined;

        switch (type) {
            case 'info':
                result = await window.showInformationMessage(msg, ...actions);
                break;

            case 'warn':
                result = await window.showWarningMessage(msg, ...actions);
                break;

            case 'error':
                result = await window.showErrorMessage(msg, ...actions);
        }

        return result;
    }
}
