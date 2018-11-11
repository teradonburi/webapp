/*globals module: false require: false __dirname: false */
const webpack = require('webpack')

module.exports = {
  mode: 'development', // 開発モード
  devtool: 'cheap-module-source-map', // ソースマップファイル追加
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    __dirname + '/index', // エントリポイントのjsxファイル
  ],
  resolve: {
    modules: ['modules', 'node_modules'],
    extensions: ['.js', '.json'],
  },
  // React Hot Loader用のデバッグサーバ(webpack-dev-server)の設定
  devServer: {
    contentBase: __dirname, // index.htmlの格納場所
    historyApiFallback: true, // history APIが404エラーを返す時、index.htmlに遷移(ブラウザリロード時など)
    inline: true, // ソース変更時リロードモード
    hot: true, // HMR(Hot Module Reload)モード
    port: 7070, // 起動ポート
    proxy: {
      '**': {
        target: 'http://127.0.0.1:9090',
        changeOrigin: true,
      },
    },
  },
  output: {
    publicPath: '/dist', // distフォルダ以下を公開パスに指定
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.NamedModulesPlugin(), // 名前変更無効プラグイン利用
    new webpack.HotModuleReplacementPlugin(), // HMR(Hot Module Reload)プラグイン利用
  ],
  module: {
    rules: [{
      test: /\.js?$/, // 拡張子がjsで
      exclude: /node_modules/, // node_modulesフォルダ配下は除外
      include: [
        __dirname, // client配下のJSファイルが対象
      ],
      use: {
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: [
            [
              'env', {
                targets: {
                  browsers: ['last 2 versions', '> 1%'],
                },
                modules: false,
                useBuiltIns: true,
              },
            ],
            'stage-0',
            'react',
          ],
          plugins: ['transform-class-properties', 'transform-decorators-legacy', 'react-hot-loader/babel'],
        },
      },
    }],
  },
}

