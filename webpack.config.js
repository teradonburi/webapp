const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'inline-source-map', // ソースマップファイル追加 
  mode: 'development',
  entry: './client/main.js', // エントリポイントのjsxファイル
  resolve: {
    modules: ['client', 'node_modules'],
    extensions: ['.js', '.json'],
  },
  output: {
    filename: 'main.js' // 出力するファイル
  },
  plugins: [
    new BrowserSyncPlugin(
      // BrowserSync options
      {
        host: 'localhost',
        port: 4000,
        files: ['server', 'dist'],
        reloadDelay: 500,
        proxy: 'http://localhost:5000/'
      },
      // plugin options
      {
        reload: true
      }
    ),
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'index.html',
      template: 'public/index.html'
    })
  ],
  module: {
    rules: [{
      test: /\.js?$/, // 拡張子がjsで
      exclude: /node_modules/, // node_modulesフォルダ配下は除外
      use: {
        loader: 'babel-loader', // babel-loaderを使って変換する
        options: {
          presets: ['env'], // preset-envでES2015から変換
        }
      }
    }]
  }
}