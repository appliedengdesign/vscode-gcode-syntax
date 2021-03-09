/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

export function stripComments(line: string): string {
    // eslint-disable-next-line
    const re1 = /\s*\([^\)]*\)/g; // Remove anything inside the parentheses
    const re2 = /\s*;.*/g; // Remove anything after a semi-colon to the end of the line, including preceding spaces
    const re3 = /\s+/g;

    return line.replace(re1, '').replace(re2, '').replace(re3, '');
}
