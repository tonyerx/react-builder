const path = require('path')
const webpack = require('webpack')
const setting = require('./setting.js')[process.env.NODE_ENV]
const config = require('./config')(process.env.NODE_ENV)
const webpackDevServer = require('webpack-dev-server')

if (process.env.NODE_ENV === 'dev') {
  const serverUrl = setting.hostname + ':' + setting.port
  // 提供虚拟服务器
  for(let k in config.entry) {
    config.entry[k].unshift('webpack-dev-server/client?' + serverUrl, 'webpack/hot/dev-server')
  }
  // 热更新插件
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  const compiler = webpack(config)
  var server = new webpackDevServer(compiler, {
    // hot: true,
    stats: {
      color: true,
      chunks: false
    }
  })
  server.listen(setting.port, function(err) {
    if (err) {
      console.log(err)
      return
    }
  })
} else {
  const compiler = webpack(config)
  
  compiler.run((err, stats) => {
    if (err) {
      console.error(err.stack || err)
  
      if (err.details) {
        console.error(err.details)
      }
  
      return
    }
  
    if (stats.hasErrors()) {
      console.log(stats.toString('errors-only'))
  
      return
    }
  
    if (stats.hasWarnings()) {
      //
    }
  
    console.log(stats.toString({
      chunks: false,
      colors: true
    }))
  })
}



