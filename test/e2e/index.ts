/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
import path from 'path';
import Mocha from 'mocha';
import glob from 'glob';

export const run = (testsRoot: string): Promise<void> => {
    // Create the mocha test
    const mocha = new Mocha({
        ui: 'tdd',
        timeout: 15000,
        color: true,
    });

    return new Promise((c, e) => {
        glob('**/**.test.js', { cwd: testsRoot }, (error, files) => {
            if (error) {
                return e(error);
            }

            try {
                files.forEach((file: string) => mocha.addFile(path.resolve(testsRoot, file)));
                // Run the mocha test
                mocha.run((failures: number) => {
                    if (failures > 0) {
                        e(new Error(`${failures} tests failed.`));
                    } else {
                        c();
                    }
                });
            } catch (err) {
                e(err);
            }
        });
    });
};
