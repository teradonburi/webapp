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
  // React Hot Loader用のデバッグサーバ(webpack-dev-server)の設定
  devServer: {
    contentBase: __dirname, // index.htmlの格納場所
    historyApiFallback: true, // history APIが404エラーを返す時、index.htmlに遷移(ブラウザリロード時など)
    inline: true, // ソース変更時リロードモード
    hot: true, // HMR(Hot Module Reload)モード
    port: 5050, // 起動ポート
    publicPath: '/',
    proxy: {
      '**': {
        target: 'http://0.0.0.0:5000',
        secure: false,
        logLevel: 'debug',
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
      include: __dirname, // client配下のJSファイルが対象
      use: {
        loader: 'babel-loader',
        options: {
          // 以下のフォルダにキャッシュを有効にします ./node_modules/.cache/babel-loader/
          // 変更時のリビルドが速くなります
          cacheDirectory: true,
          presets: ['env', 'react'],
          plugins: ['transform-class-properties', 'transform-decorators-legacy', 'react-hot-loader/babel'],
        },
      },
    }],
  },
}

