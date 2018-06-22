/** 
 * 根据运行环境生成webpack配置
*/
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const ESLintFriendlyFormatter = require('eslint-friendly-formatter')

const setting = require('./setting')
const { dev, pre, prod } = setting

function rsv(p) {
  return path.resolve(__dirname, p)
}

module.exports = env => {
  const isDev = env === 'dev'
  const jsSourceMap = setting[env].sourceMap || false
  const cssSourceMap = !!setting[env].sourceMap
  console.log('----当前环境----\n', env)

  // 入口配置
  const entry = setting.entries
  if (isDev && setting[env].mock) {
    for(let k in entry) {
      entry[k].unshift(require.resolve('./mock'))
    }
  }
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

  const devtool = jsSourceMap


  const postcssRule = {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      sourceMap: cssSourceMap,
      plugins: () => [
        autoprefixer({
          browsers: [
              'last 4 versions', 
              'Firefox ESR', '> 1%', 
              'not ie < 9', 
              'iOS >= 8', 
              'Android >= 4'
          ],
          flexbox: 'no-2009'
        })
      ]
    }
  }

  const lessRule = {
    loader: 'less-loader',
    options: {
      sourceMap: cssSourceMap
    }
  }

  // css编译规则
  const cssRule =
    isDev
      ? [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader',
              postcssRule,
            ]
          },
          {
            test: /\.less$/,
            exclude: /\.m\.less$/,
            use: [
              'style-loader',
              'css-loader',
              postcssRule,
              lessRule
            ]
          },
          {
            test: /\.m\.less$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  sourceMap: cssSourceMap,
                  modules: true,
                  localIdentName: '[path]_[local]',
                }
              },
              postcssRule,
              lessRule
            ]
          }
        ]
      : [
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: cssSourceMap,
                    minimize: true,
                  }
                },
                postcssRule
              ]
            })
          },
          {
            test: /\.less$/,
            exclude: /\.m\.less$/,            
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: cssSourceMap,
                    minimize: true,
                  }
                },
                postcssRule,
                lessRule
              ]
            })
          },
          {
            test: /\.m\.less$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: cssSourceMap,
                    modules: true,
                    minimize: true,
                    localIdentName: '[hash:base64:5]'
                  }
                },
                postcssRule,
                lessRule
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
          plugins: [
            ["import", { libraryName: "antd-mobile", style: "css" }]
          ],
          presets: [
            'stage-0',
            'env',
            'react'
          ],
        }
      },
    ]
  }
  // 代码规范检测规则
  const eslintRule = setting[env].eslint
    ? {
      test: /\.(js|jsx)$/,
      loader: 'eslint-loader',
      enforce: 'pre',
      include: [rsv('../src')],
      options: {
        formatter: ESLintFriendlyFormatter,
      }
    }
    : {}
  
  // 编译规则汇总
  const module = {
    rules: [
      {
        test: /\.(png|jpg|gif|svg|ttf|eot|woff)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 15000,
              name: isDev ? 'static/media/[name].[ext]': 'static/media/[name].[ext]?[hash:8]'
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
    ].concat(cssRule, jsRule, eslintRule)
  }
  console.log('----loader配置----\n', module.rules)

  function getHtmlPlugin() {
    const tpls = setting.tpls
    const pluginArr = []
    for(let k in entry) {
      if (k === 'vendor') break
      const tplName = tpls[k] ? tpls[k] : k
      pluginArr.push(
        new HtmlWebpackPlugin({
          chunks: ['manifest', 'vendor', k],
          filename: k + '.html',
          template: rsv(setting.tplRoot + tplName + '.html'),
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