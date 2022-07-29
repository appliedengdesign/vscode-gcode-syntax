/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Applied Eng & Design All rights reserved.
 *  Licensed under the MIT License. See License.md in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

'use strict';

// @ts-check
/** @typedef {import('webpack').Configuration} */

const ESLintPlugin = require('eslint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');




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
            errorDetails: true,
            warningsCount: true,
            timings: true,
        },
    };

    return config;
}

function getWebviewsConfig(mode, env) {
    const basePath = path.resolve(__dirname, 'src', 'webviews', 'apps');
    const outPath = path.resolve(__dirname, 'dist', 'webviews');
    const plugins = [];

    const entries = getWebviewEntries(basePath);

    plugins.push(
        new ESLintPlugin({
            extensions: ['ts']
        })
    );

    plugins.push(...getWebviewPlugins(outPath, basePath, entries));

    const config = {
        name: 'webviews',
        mode: mode,
        target: 'web',
        devtool: 'source-map',
        context: basePath,
        
        entry: entries,

        output: {
            path: path.resolve(__dirname, 'dist', 'webviews'),
            filename: `[name]/[name][ext]`,
            publicPath: '{root}/dist/webviews/',
            clean: true,
        },

        plugins: plugins,

        module: {
            rules: [
                {
                    exclude: /\.d.ts$/i,
                    test: /.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.s[ca]ss$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                //esModule: false,
                            }
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
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    type: 'asset/resource',
                },
            ],
        },

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },

        infrastructureLogging: {
            level: 'log',
        },

        stats: {
            preset: 'error-warnings',
            assets: true,
            colors: true,
            env: true,
            errorsCount: true,
            errorDetails: true,
            warningsCount: true,
            timings: true,
        },
    };

    return config;
}

function getWebviewEntries(_path) {
    // Get Entries from apps path
    const entries = fs.readdirSync(_path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .filter(dirent => dirent.name !== 'shared')
    .map(dirent => dirent.name)
    .reduce((result, item, index, array) => {
        // App TS File
        result[item] = { import: [`./${item}/${item}.ts`, `./${item}/${item}.scss` ], filename: `${item}/${item}.js` };

        // App SCSS File
        //result[`${item}.scss`] = { import: `./${item}/${item}.scss`, filename: `${item}/${item}.css` };

        return result;
    }, {});
    
    return entries;
}

function getWebviewPlugins(_outPath, _basePath, entries) {
    const webviewPlugins = [];

    Object.keys(entries).forEach(entry => {
        if (entry !== undefined && (/\.s[ca]ss$/).test(entry)) {
            const name = entry.split('.').shift();
            if (name) {
                webviewPlugins.push(
                    new MiniCssExtractPlugin({
                        filename: path.join(name, `${name}.css`),
                        chunkFilename: '[id].css',
                    })
                );
            }   

            return;
        }
        webviewPlugins.push(
            new HtmlWebpackPlugin({
                template: path.resolve(_basePath, entry, `${entry}.html`),
                inject: 'head',
                filename: path.resolve(_outPath, `${entry}`, `${entry}.html`),
            }),
        );

        webviewPlugins.push(
            new MiniCssExtractPlugin({
                filename: `${entry}/${entry}.css`,
                
            })
        );

        return;
    });

    //console.log(webviewPlugins);
    //process.exit(1);
    return webviewPlugins;
}