import { MessageBox, Message } from 'element-ui'

const msg = {}

/**
 * 提示失败信息
 * @param message
 */
msg.error = function(message) {
  Message({
    message: message,
    type: 'error',
    duration: 5 * 1000
  })
}

/**
 * confirm框
 * @param message
 * @param title
 * @param options
 * @returns {Promise<MessageBoxData>}
 */
msg.confirm = function(message, title, options) {
  return MessageBox.confirm(message, title || '提示信息', options)
}

/**
 * 提示成功信息
 * @param message
 */
msg.success = function(message) {
  MessageBox.alert(message, {
    title: '提示信息',
    type: 'success'
  })
}

/**
 * 提示成功信息（辅助提示）
 * @param message
 */
msg.successTip = function(message) {
  Message({
    message: message,
    type: 'success',
    duration: 5 * 1000
  })
}

/**
 * 提交内容
 * @param message
 * @param options
 * @returns {Promise<MessageBoxData>}
 */
msg.prompt = function(message, options) {
  const _options = Object.assign({
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    title: '消息提示'
  }, options)

  return MessageBox.prompt(message, _options.title, _options)
}
export default msg
