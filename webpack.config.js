/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

const ESLintPlugin = require('eslint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

// @ts-check
/** @typedef {import('webpack').Configuration} */

module.exports = function (env, argv) {
    const mode = argv.mode || 'none';

    env = {
        analyzeBundle: false,
        analyzeDeps: false,
        ...env,
    };

    return [
        getExtensionConfig(mode, env),
        getWebviewsConfig(mode, env),
    ];
};

function getExtensionConfig(mode, env) {
    const plugins = [];

    plugins.push(
        new ESLintPlugin({
            extensions: ['ts']
        })
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
        },

        devtool: 'source-map',

        externals: {
            vscode: 'commonjs vscode',
            '@appliedengdesign/gcode-reference': '@appliedengdesign/gcode-reference',
        },

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
            mainFields: ['browser', 'module', 'main'],
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

        infrastructureLogging: {
            level: 'log',
        },

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

function getWebviewsConfig(mode, env) {
    const basePath = path.join(__dirname, 'src', 'webviews', 'apps');
    const plugins = [];

    plugins.push(
        new ESLintPlugin({
            extensions: ['ts']
        })
    );

    plugins.push(
        new MiniCssExtractPlugin({
            filename: '[name].css',
        })
    );

    const config = {
        name: 'webviews',
        mode: mode,
        target: 'web',
        devtool: 'source-map',
        context: basePath,
        
        entry: {
            'calc/calc': './calc/calc.ts'
        },

        output: {
            filename: '[name].js',
            path: path.join(__dirname, 'dist', 'webviews'),
            publicPath: '#{root}/dist/webviews/[name]',
        },

        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                url: false,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            }
                        }
                    ],
                    exclude: /node_modules/,
                },
            ],
        },

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },

        plugins: plugins,

        infrastructureLogging: {
            level: 'log',
        },

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