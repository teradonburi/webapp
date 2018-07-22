/*globals module: false require: false __dirname: false process: false */
const webpack = require('webpack')
const path = require('path')
const webpackConfig = require('./webpack.config.js')
const { InjectManifest } = require('workbox-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const revision = require('child_process').execSync('git rev-parse HEAD').toString().trim()


function createConfig() {

  const config = Object.assign({}, webpackConfig)

  // ソースマップファイルをファイル出力
  config.mode = 'production'
  // ソースマップファイルをファイル出力
  config.devtool = 'source-map'
  // React Hot loaderは外す
  config.entry = {
    'bundle': [
      'babel-polyfill',
      path.join(__dirname, '/index'), // エントリポイントのjsxファイル
    ],
  }
  // 出力ファイル
  config.output = {
    path: `${__dirname}/dist`,
    filename: 'js-[hash:8]/[name].js',
    chunkFilename: 'js-[hash:8]/[name].js',
    publicPath: '/',
  }

  config.optimization = {
    splitChunks: {
      cacheGroups: {
        react: {
          test: /react/,
          name: 'react',
          chunks: 'all',
        },
        core: {
          test: /redux|core-js|jss|history|matarial-ui|lodash|moment|rollbar|prefixer|\.io|platform|axios/,
          name: 'core',
          chunks: 'all',
        },
      },
    },
  }

  config.plugins = [
    new InjectManifest({
      swSrc: './sw.js',
    }),
    // 環境変数をエクスポート
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'GIT_REVISION': JSON.stringify(revision),
      },
    }),
    // HTMLテンプレートに生成したJSを埋め込む
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
    }),
  ]

  return config
}

const configs = [
  createConfig(),
]

module.exports = configs