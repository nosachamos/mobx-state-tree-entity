const externals = require('./webpack.config').externals;
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: [path.join(__dirname, '.tmp/index.js')],
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'index.min.js',
    library: 'mobx-state-tree-entity',
    libraryTarget: 'umd'
  },
  externals,
  optimization: {
    minimizer: [new UglifyJsPlugin()]
  }
};
