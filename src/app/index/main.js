/**
 * 入口文件
 */

import React from 'react'
import ReactDOM from 'react-dom'
import FastClick from 'fastclick'
import App from './app'

// 是否开启vconsole
const isDebug = /debug=true/.test(window.location.search)
const shouldLoadConsole = (
  builder.ENV !== 'production' || isDebug === true
)
if (shouldLoadConsole) {
  System.import('vconsole').then((VConsole) => {
    /* eslint-disable no-unused-vars */
    const vConsole = new VConsole()
    /* eslint-enable no-unused-vars */
  })
}

// 取消移动端点击300ms延迟
document.addEventListener('DOMContentLoaded', function () {
  FastClick.attach(document.body)
}, false)

ReactDOM.render(<App />, document.getElementById('root'))
