const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base');
const version = JSON.stringify(require('../package.json').version);

module.exports = merge(baseWebpackConfig, {
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      },
      version,
      DEBUG_MODE: true
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});
