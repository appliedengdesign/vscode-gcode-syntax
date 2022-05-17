/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

// @ts-check
/** @typedef {import('webpack').Configuration} */

function getExtensionConfig(mode, env) {
    const plugins = [];
    plugins.push(
        new ForkTsCheckerWebpackPlugin({
            async: false,
            // eslint: { enabled: true, files: 'src/**/*.ts', options: { cache: true } },
            formatter: 'basic',
        }),
    );

    if (env.analyzeBundle) {
        plugins.push(new BundleAnalyzerPlugin());
    }

    const config = {
        name: 'extension',
        mode: mode,
        target: 'node',
        entry: './src/extension.ts',

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'extension.js',
            libraryTarget: 'commonjs2',
            devtoolFallbackModuleFilenameTemplate: '../[resource-path]',
            clean: true,
        },

        devtool: 'source-map',

        externals: {
            vscode: 'commonjs vscode',
            '@appliedengdesign/gcode-reference': '@appliedengdesign/gcode-reference',
        },

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    include: path.join(__dirname, 'src'),
                    use: [
                        {
                            loader: 'ts-loader',
                        },
                    ],
                },
            ],
        },

        plugins: plugins,

        stats: {
            preset: 'error-warnings',
            assets: true,
            colors: true,
            env: true,
            errorsCount: true,
            warningsCount: true,
            timings: true,
        },
    };

    return config;
}

module.exports = function (env, argv) {
    const mode = argv.mode || 'none';

    env = {
        analyzeBundle: false,
        analyzeDeps: false,
        ...env,
    };

    return getExtensionConfig(mode, env);
};
