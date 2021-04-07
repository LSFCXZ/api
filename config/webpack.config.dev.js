const { merge } = require('webpack-merge')

const baseWebpackConfig = require('./webpack.config.base')

const webpackconfig = merge(baseWebpackConfig, {
  devtool: 'eval-source-map',
  mode: 'development',
  stats: { children: false }//不需要日志消息
})
module.exports = webpackconfig