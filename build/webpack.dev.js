/*
* @description 实现热更新，不压缩代码，完整的sourceMap
* */
const path = require('path');
const Webpack = require('webpack');
const WebpackMerge = require('webpack-merge');
const webpackConfig = require('./webpack.config');

module.exports = WebpackMerge(webpackConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        port: 8888,
        hot: true,
        static: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new Webpack.HotModuleReplacementPlugin()
    ]
});
