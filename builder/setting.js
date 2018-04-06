const path = require('path')

function rsv(p) {
  return path.resolve(__dirname, p)
}

module.exports = {
  entries: {
    index: [rsv('../src/app/index/main.js')],
  },
  outRoot: rsv('../dist'),
  publicPath: '/static/cgVoice',
  tpls: {
      
  },
  tplRoot: '../src/template/',

  vendor: ['react', 'react-dom', 'prop-types', 'classnames'],
  polyfill: true,

  resolve: {
    extensions: ['.js', '.css', '.html',],
  },
  

  dev: {
    sourceMap: 'source-map',
  },
  pre: {
    sourceMap: 'cheap-module-source-map'
  },
  prod: {
    sourceMap: false
  },
}