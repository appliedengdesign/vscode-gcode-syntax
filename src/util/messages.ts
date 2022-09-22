/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { env, MessageItem, Uri, window } from 'vscode';
import { constants } from './constants';
import { Version } from './version';

enum MessageType {
    Info,
    Warn,
    Error,
}

export class Messages {
    static async showSupportGCodeMessage() {
        const actions: MessageItem[] = [
            { title: 'Leave a Review' },
            { title: 'Become a Sponsor' },
            { title: 'Subscribe to our YouTube' },
        ];

        const result = await Messages._showMessage(
            MessageType.Info,
            'G-Code Syntax is offered to everyone for free. If you find it useful, please consider ' +
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

        const result = await Messages._showMessage(
            MessageType.Info,
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

    static async showRefreshWarningMessage(): Promise<boolean> {
        // Show Warning message about large file refresh

        const actions: MessageItem[] = [{ title: 'Continue' }, { title: 'Abort' }];

        const result = await Messages._showMessage(
            MessageType.Warn,
            'File size is above 10K lines. Tree / Stats refresh may not work.',
            ...actions,
        );

        if (result != null) {
            if (result === actions[0]) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    static async showErrorMessage(msg: string) {
        await this._showMessage(MessageType.Error, msg);
    }

    private static async _showMessage(
        type: MessageType,
        msg: string,
        ...actions: MessageItem[]
    ): Promise<MessageItem | undefined> {
        let result: MessageItem | undefined = undefined;

        switch (type) {
            case MessageType.Info:
                result = await window.showInformationMessage(msg, ...actions);
                break;

            case MessageType.Warn:
                result = await window.showWarningMessage(msg, ...actions);
                break;

            case MessageType.Error:
                result = await window.showErrorMessage(msg, ...actions);
        }

        return result;
    }
}
