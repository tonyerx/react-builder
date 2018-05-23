const path = require('path')

function rsv(p) {
  return path.resolve(__dirname, p)
}

module.exports = {
  entries: {
    index: [rsv('../src/app/index/main.js')],
  },
  outRoot: rsv('../dist'),
  publicPath: '/static/constellation/',
  tpls: {
      
  },
  tplRoot: '../src/template/',

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