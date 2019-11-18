var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: './src/index.js',
    //    target: 'node',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'build.js'
    },
    module: {
        rules: [
            // {
            //     test: /\.scss$/,
            //     use: [
            //         'vue-style-loader',
            //         'css-loader',
            //         'sass-loader'
            //     ]
            // },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader'],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {}
                    // other vue-loader options go here
                }
            },
            //            {
            //                test: /\.js$/,
            //                loader: 'babel-loader',
            //                exclude: /node_modules/
            //            },
            {
                test: /\.(png|jpg|gif|svg|ico)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            // '~$': './'
            '~': path.resolve(__dirname, './src/')
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
        port: 9000,
        host: 'localhost',
        quiet: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
}
