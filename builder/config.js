/** 
 * 根据运行环境生成webpack配置
*/
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')

const setting = require('./setting')
const { dev, pre, prod } = setting

function rsv(p) {
  return path.resolve(__dirname, p)
}

module.exports = env => {
  const isDev = env === 'dev'
  console.log('----当前环境----\n', env)

  // 入口配置
  const entry = setting.entries
  if (setting.polyfill) {
    for(let k in entry) {
      entry[k].unshift('babel-polyfill')
    }
  }
  if (!isDev && setting.vendor && setting.vendor.length > 0) {
    // 非开发模式下打包vendor
    entry.vendor = setting.vendor
  }
  console.log('----入口配置----\n', entry)

  // 输出配置
  const output = {
    filename: isDev ? 'static/js/[name].js' : 'static/js/[name].js?[chunkhash:8]',
    chunkFilename: isDev ? 'static/js/[name].chunk.js' : 'static/js/[name].chunk.js?[chunkhash:8]',
    path: setting.outRoot,
    publicPath: isDev ? '/' : setting.publicPath,
  }
  
  const resolve = setting.resolve

  const devtool = setting[env].sourceMap || false

  const postcssRule = {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [
        autoprefixer()
      ]
    }
  }

  // css编译规则
  const cssRule =
    isDev
      ? [
          {
            test: /\.css$/,
            exclude: /\.m\.css$/,
            use: [
              'style-loader',
              'css-loader',
              postcssRule,
            ]
          },
          {
            test: /\.m\.css$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[path]_[local]',
                }
              },
              postcssRule,
            ]
          }
        ]
      : [
          {
            test: /\.css$/,
            exclude: /\.m\.css$/,            
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    minimize: true,
                  }
                },
                postcssRule,
              ]
            })
          },
          {
            test: /\.m\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    modules: true,
                    minimize: true,
                    localIdentName: '[hash:base64:5]'
                  }
                },
                postcssRule,
              ]
            })
          }
        ]

  
  // js编译规则
  const jsRule = {
    test: /\.js|jsx$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: [
            'stage-0',
            'env',
          ],
        }
      }
    ]
  }
  // 编译规则汇总
  const module = {
    rules: [
      {
        test: /\.(png|jpg|gif|svg|ttf|eot|woff)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
              name: isDev ? 'static/media/[name].[ext]': 'media/[name].[ext]?[hash:8]'
            }
          }

        ]
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      },
    ].concat(cssRule, jsRule)
  }
  console.log('----loader配置----\n', module.rules)

  function getHtmlPlugin() {
    const tpls = setting.tpls
    const pluginArr = []
    for(let k in entry) {
      if (k === 'vendor') break
      pluginArr.push(
        tpls[k]
        ? new HtmlWebpackPlugin(tpls[k])
        : new HtmlWebpackPlugin({
           chunks: ['manifest', 'vendor', k],
           filename: k + '.html',
           template: rsv(setting.tplRoot + k + '.html'),
           inject: true
        })
      )
    }
    return pluginArr
  }
  const commonPlugins = [
    new webpack.DefinePlugin({
      'builder': {
        'ENV': JSON.stringify(env)
      }
    }),
  ]
  const plugins =
    isDev
      ? commonPlugins.concat(getHtmlPlugin())
      : [
        new CleanWebpackPlugin(['dist'], {
          root: rsv('..'),
        })
      ].concat(commonPlugins, getHtmlPlugin(), [
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: Infinity
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'manifest'
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: setting[env].sourceMap,
          compress: {
            warnings: false
          },
        }),
        new ExtractTextPlugin('static/css/[name].css?[contenthash:8]'),
      ])
  console.log('----plugin配置----\n', plugins)
  
  return {
    entry,
    output,
    resolve,
    devtool,
    module,
    plugins
  }
}