const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html模版引擎
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // 清除文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 打包css
// const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'); // 拆分css
const {VueLoaderPlugin} = require('vue-loader'); // 解析vue文件
const os = require('os');
const workers = os.cpus().length;
const threadLoader = require('thread-loader'); // 多进程打包
const devMode = process.argv.indexOf('--mode=production') === -1;

//通过预警worker池来防止启动worker时的高延时
threadLoader.warmup({}, ['babel-loader', 'sass-loader']);

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
            filename: devMode ? '[name].css' : "[name].[fullhash].css",
            chunkFilename: devMode ? "[id].css" : '[id].[fullhash].css',
        }),
        new VueLoaderPlugin(),
        // new webpack.DllReferencePlugin({
        //     name: '_dll_[name]',
        //     context: __dirname,
        //     // manifest: require('./main.manifest')
        //     manifest: path.join(__dirname, '../dist', '[name].manifest.json')
        // })
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
                use: [
                    {
                        loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../dist/css/'
                        }
                    },
                    'css-loader', {
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
                use: [
                    {
                        loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../dist/css'
                        }
                    },
                    'css-loader', {
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
                //把js文件处理交给id为happyBabel的HappyPack的实例执行
                use: {
                    // loader: 'babel-loader',
                    // options: {
                    //     presets: ['@babel/preset-env']
                    // }
                    loader: 'thread-loader',
                    options: {
                        workers: workers,
                        workerParallelJobs: 50, // 一个worker进程中并执行工作的数量
                        workerNodeArgs: ['--max-old-space-size=1024'],
                        poolRespawn: false, // 允许重新生成一个僵死的worker
                        poolTimeout: 2000, // 闲置时定时删除worker进程
                        poolParallelJobs: 50, // 池分配给worker的工作数量
                        name: 'my-webpack-pool' // 池的名称
                    }
                },
                include: path.resolve('src'),
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
