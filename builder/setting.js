const path = require('path')

function rsv(p) {
  return path.resolve(__dirname, p)
}

module.exports = {
  entries: {
    index: [rsv('../src/apps/index/main.js')],
    own: [rsv('../src/apps/own/main.js')]
  },
  outRoot: rsv('../dist'),
  publicPath: '/static/constellation/',
  tpls: {
    own: 'public'
  },
  tplRoot: '../src/templates/',

  vendor: ['react', 'react-dom', 'prop-types', 'classnames'],
  polyfill: true,

  resolve: {
    extensions: ['.js', '.jsx', '.css', '.html',],
  },
  

  dev: {
    sourceMap: 'source-map',
    mock: true,
    eslint: true
  },
  pre: {
    sourceMap: 'cheap-module-source-map'
  },
  prod: {
    sourceMap: false
  },
}