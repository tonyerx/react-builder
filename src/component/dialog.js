import $ from 'webpack-zepto'

function Dialog() {
  this.dialog = '.dialog'
  this.msg = '.dialog-msg'
  this.confirm = '.dialog-confirm'
  this.cancel = '.dialog-cancel'
}

Dialog.prototype = {
  constructor: Dialog,

  /**
   * @method 弹窗显示方法
   * @param {object} opts
   * @prop {string} content 内容文本 
   * @prop {string} confirmText 确认按钮的文本 
   * @prop {func} cb 点击确认按钮后的回调 
   * @prop {string} cancelText 取消按钮的文本 
   * @prop {bool} unHide 点击按钮后是否关闭弹窗 
   */
  show({ content = '提示', confirmText = '确定', cb, cancelText, unHide = false }) {
    $(this.dialog).hide()
    $(this.msg).text(content)
    // 之前的弹窗有可能残余事件，需要先remove掉
    $(this.confirm).text(confirmText).off('click').one('click', () => {
      if (!unHide) {
        this.hide()
      }
      cb && cb()
    })
    if (cancelText) {
      $(this.cancel).show().text(cancelText).off('click').one('click', () => {
        this.hide()
      })
    } else {
      $(this.cancel).hide()
    }
    $(this.dialog).removeClass('animateOut').addClass('animateIn').show()
  },

  hide() {
    $(this.dialog).removeClass('animateIn').addClass('animateOut')
  }
}

export default Dialog