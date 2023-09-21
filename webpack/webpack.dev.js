const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./webpack.common.js')

const config = Object.assign({}, common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './webpack.dev.html'),
      filename: 'index.html',
      chunks: ['index']
    }),
    new webpack.DefinePlugin({ process: { env: JSON.stringify('dev') } })
  ]
})

module.exports = config