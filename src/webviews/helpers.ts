/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

import crypto from 'crypto';

export function getNonce(): string {
    return crypto.randomBytes(16).toString('base64');
}
