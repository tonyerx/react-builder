/**
 * 入口文件
 */

import FastClick from 'fastclick'
import App from './app'

// 是否开启vconsole
const isDebug = /debug=true/.test(window.location.search)
const shouldLoadConsole = (
  builder.ENV !== 'production' || isDebug === true
)
if (shouldLoadConsole) {
  System.import('vconsole').then((VConsole) => {
    const vConsole = new VConsole()
  })
}

// 取消移动端点击300ms延迟
document.addEventListener('DOMContentLoaded', function() {
  FastClick.attach(document.body)
}, false)

;(function() {
  const app = new App()
})()