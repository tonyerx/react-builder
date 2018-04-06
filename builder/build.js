const path = require('path')
const webpack = require('webpack')
const config = require('./config')(process.env.NODE_ENV)
const webpackDevServer = require('webpack-dev-server')

if (process.env.NODE_ENV === 'dev') {
  const serverUrl = 'http://localhost:8081'
  // 提供虚拟服务器
  for(let k in config.entry) {
    config.entry[k].unshift('webpack-dev-server/client?' + serverUrl, 'webpack/hot/dev-server')
  }
  // 热更新插件
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  const compiler = webpack(config)
  var server = new webpackDevServer(compiler, {
    // hot: trufe,
    stats: {
      color: true,
      chunks: false
    }
  })
  console.log('view at 192.168.10.124:80')
  server.listen(8081, function(err) {
    if (err) {
      console.log(err)
      return
    }
  })
} else {
  // const compiler = webpack(config)
  // compiler.plugin('compilation', compilation => {
  //   compilation.plugin('html-webpack-plugin-after-html-processing', (data, cb) => {
  //     var tplArgs = data.plugin.options.tplArgs
      
  //     if (tplArgs) {    
  //       data.html = _.template(data.html)(tplArgs)
  //     }
  
  //     cb(null, data)
  //   })
  // })
  
  // compiler.run((err, stats) => {
  //   if (err) {
  //     console.error(err.stack || err)
  
  //     if (err.details) {
  //       console.error(err.details)
  //     }
  
  //     return
  //   }
  
  //   if (stats.hasErrors()) {
  //     console.log(stats.toString('errors-only'))
  
  //     return
  //   }
  
  //   if (stats.hasWarnings()) {
  //     //
  //   }
  
  //   console.log(stats.toString({
  //     chunks: false,
  //     colors: true
  //   }))
  // })
}



