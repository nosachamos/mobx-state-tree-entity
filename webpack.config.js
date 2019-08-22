const path = require('path');

module.exports = {
  entry: [path.join(__dirname, '.tmp/index.js')],
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'index.js',
    library: 'ters',
    libraryTarget: 'umd'
  },
  externals: {
    'mobx-devtools-mst': {
      commonjs2: 'mobx-devtools-mst',
      commonjs: 'mobx-devtools-mst',
      amd: 'mobx-devtools-mst'
    },
    'mobx-react': {
      commonjs2: 'mobx-react',
      commonjs: 'mobx-react',
      amd: 'mobx-react'
    },
    mobx: {
      commonjs2: 'mobx',
      commonjs: 'mobx',
      amd: 'mobx'
    },
    'mobx-state-tree': {
      commonjs2: 'mobx-state-tree',
      commonjs: 'mobx-state-tree',
      amd: 'mobx-state-tree'
    },
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  },
  optimization: {
    minimize: false
  }
};
