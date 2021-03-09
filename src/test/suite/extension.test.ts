/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
import * as assert from 'assert';
import { after } from 'mocha';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    void vscode.window.showInformationMessage('Start all tests.');

    after(() => {
        void vscode.window.showInformationMessage('All Tests Done!');
    });

    test('Sample test', () => {
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });
});

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
