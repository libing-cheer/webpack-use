/*
* @description 压缩代码、提取css文件、合理的sourceMap、分割代码
* */
const path = require('path');
const WebpackMerge = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 拷贝静态资源
// const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin'); // 压缩js
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css
const ParallerUglifyPlugin = require('webpack-parallel-uglify-plugin'); // 增强代码压缩

module.exports = WebpackMerge(webpackConfig, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    plugins: [
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../public'),
            to: path.resolve(__dirname, '../dist')
        }])
    ],
    optimization: {
        minimizer: [
            /**
             new UglifyWebpackPlugin({
                cache: true, //文件缓存
                parallel: true, // 多进程 提升构建速度
                sourceMap: true // 使用原映射 将错误信息模块映射到模块
            }), // 压缩js
             */
            new ParallerUglifyPlugin({
                cacheDir: '.cache/',
                uglifyJS: {
                    output: {
                        comments: false,
                        beautify: false
                    },
                    compress: {
                        drop_console: true,
                        collapse_vars: true,
                        reduce_vars: true
                    }
                }
            }),
            new OptimizeCssAssetsWebpackPlugin({}) // 压缩css
        ],
        splitChunks: { // 代码拆分
            chunks: 'all',
            cacheGroups: {
                libs: {
                    name: 'chunk-libs',
                    test: /[\\/]node_mmodules[\\/]/,
                    priority: 'initial',
                    chunks: 'initial'
                }
            }
        }
    }
});

