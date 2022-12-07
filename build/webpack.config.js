const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html模版引擎
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // 清除文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 打包css
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'); // 拆分css
const {VueLoaderPlugin} = require('vue-loader'); // 解析vue文件
const Webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        index: ['@babel/polyfill', path.resolve(__dirname, '../src/index.js')],
        header: ['@babel/polyfill', path.resolve(__dirname, '../src/header.js')]
    },
    output: {
        filename: '[name].[fullhash:8].js',
        path: path.resolve(__dirname, '../dist')
    },
    // output的publicPath是用来给生成的静态资源路径添加前缀的；
    // devServer中的publicPath是用来本地服务拦截带publicPath开头的请求的；
    // contentBase是用来指定被访问html页面所在目录的；
    devServer: {
        port: 8888,
        hot: true,
        static: path.resolve(__dirname, 'dist') // 页面所在的相对目录
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            filename: 'index.html',
            chunks: ['index']
        }),

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/header.html'),
            filename: 'header.html',
            chunks: ['header']
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].[fullhash].css",
            chunkFilename: "[id].css",
        }),
        new VueLoaderPlugin(),
        new Webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src')
        },
        extensions: ['*', '.js', '.json', '.vue']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                require('autoprefixer')
                            ]
                        }
                    },

                }] // // 从右向左解析原则
            },
            {
                test: /\.less$/,
                use: ['vue-style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: [
                                require('autoprefixer')
                            ]
                        }
                    }
                }, 'less-loader']
            },
            {
                test: /\.(jpe?g|png|gif)$/i, // 图片文件
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            esModule: false,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'img/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ],
                type: 'javascript/auto'
            },
            {
                test: /\.(mp4|webm|mp3|wav|flac|acc)(\?.*)?$/, // 媒体文件
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            esModule: false,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'media/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ],
                type: 'javascript/auto'
            },
            {
                test: /\.(woff2?|eot|ttf)$(\?.*)?$/i, // 字体
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            esModule: false,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'fonts/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                ],
                type: 'javascript/auto'
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                use: ['vue-loader'] // vue模版
            }
        ]
    },
    mode: 'development'
};
