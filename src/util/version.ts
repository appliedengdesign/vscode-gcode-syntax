/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */
'use strict';

export interface IVersion {
    major: number;
    minor: number;
    patch: number;
}

export type VersionCheck = -1 | 0 | 1;

export class Version {
    private _version: IVersion;

    constructor(ver: IVersion | string) {
        if (typeof ver === 'string') {
            this._version = this.parseVer(ver);
        } else {
            this._version = ver;
        }
    }

    private parseVer(stringVer: string): IVersion {
        const [major, minor, patch] = stringVer.split('.');
        return {
            major: parseInt(major, 10),
            minor: parseInt(minor, 10),
            patch: patch == null ? 0 : parseInt(patch, 10),
        };
    }

    public getVersion(): IVersion {
        return this._version;
    }

    getVersionAsString(): string {
        return `${this._version.major}.${this._version.minor}.${this._version.patch}`;
    }

    compareWith(ver: IVersion | string): VersionCheck {
        // Compare Versions
        if (typeof ver === 'string') {
            ver = this.parseVer(ver);
        }

        // Check Major Version
        if (this._version.major > ver.major) {
            return 1;
        }

        if (this._version.major < ver.major) {
            return -1;
        }

        // Check Minor Version
        if (this._version.minor > ver.minor) {
            return 1;
        }

        if (this._version.minor < ver.minor) {
            return -1;
        }

        // Check Patch Version
        if (this._version.patch > ver.patch) {
            return 1;
        }

        if (this._version.patch < ver.patch) {
            return -1;
        }

        // Versions are Equal
        return 0;
    }
}
