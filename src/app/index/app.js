import $ from 'webpack-zepto'
import Dialog from '../../component/dialog'

import './style'

function Letter() {
  this.dialog = new Dialog()
  
  this.init()
}

Letter.prototype = {

  constructor: Letter,

  init() {
    this.dialog.show({
      content: '这是一个测试弹窗',
      confirmText: '确定',
      cb: this.confirm.bind(this),
      cancelText: '取消'
    })
  },

  confirm() {
    console.log('确认了')
  }
}

export default Letter