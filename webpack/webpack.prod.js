const webpack = require('webpack')
const path = require('path')
const common = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = Object.assign({}, common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin({
      currentAssets: []
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './webpack.prod.html'),
      filename: 'index.html',
      chunks: ['index']
    }),
    new webpack.DefinePlugin({ process: { env: JSON.stringify('prod') } }),
  ]
})

module.exports = config