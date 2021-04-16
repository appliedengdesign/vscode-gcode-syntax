/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

import { expect } from 'chai';
import { GCodeRuntimeParser } from '../../src/views/providers/gcodeRuntimeParser';
import fs from 'fs';
import path from 'path';

describe('G-Code Stats', () => {
    it('calculates the correct runtime', () => {
        const gcr = new GCodeRuntimeParser(
            fs.readFileSync(path.resolve(__dirname, '..', '..', 'samplenc', 'sample-profile.nc')).toString(),
        );
        gcr.update();

        expect(gcr.getRuntime()).to.be.equal(59.74464683955828);
    });
});
