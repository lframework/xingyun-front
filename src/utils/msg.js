import Vue from 'vue'

const msg = {}

/**
 * 提示失败信息
 * @param message
 */
msg.error = function(message) {
  Vue.prototype.$message.error(message)
}

/**
 * 提示失败信息（弹框）
 * @param message
 * @param title
 */
msg.errorDialog = function(message, title) {
  Vue.prototype.$error({
    title: title || '提示信息',
    content: message
  })
}

/**
 * confirm框
 * @param message
 * @param title
 * @returns {Promise<MessageBoxData>}
 */
msg.confirm = function(message, title, options = {}) {
  return new Promise((resolve, reject) => {
    Vue.prototype.$confirm({
      title: title || '提示信息',
      content: message,
      onOk: () => resolve(),
      onCancel: () => reject(),
      okText: options.okText || '确定',
      cancelText: options.cancelText || '取消'
    })
  })
}

/**
 * 提示成功信息
 * @param message
 */
msg.success = function(message) {
  Vue.prototype.$success({
    title: '提示信息',
    content: message
  })
}

/**
 * 提示成功信息（辅助提示）
 * @param message
 */
msg.successTip = function(message) {
  Vue.prototype.$message.success(message)
}

/**
 * 提交内容
 * @param message
 * @param options
 * @returns {Promise<MessageBoxData>}
 */
msg.prompt = function(message, { inputPattern, inputErrorMessage, title, inputValue }) {
  return new Promise((resolve, reject) => {
    const datas = {
      input: undefined,
      text: inputValue || ''
    }
    const change = (e) => {
      datas.text = e.target.value
    }
    Vue.prototype.$confirm({
      title: title,
      content: (h) => {
        datas.input = h(
          'div',
          [h('a-input', { props: { value: inputValue }, on: { input: change }})]
        )

        return datas.input
      },
      icon: 'exclamation-circle',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        if (inputPattern) {
          if (!inputPattern.test(datas.text)) {
            const errorMsg = inputErrorMessage || '输入信息格式有误'
            msg.error(errorMsg)
            throw new Error(errorMsg)
          }
        }

        resolve({ value: datas.text })
      }
    })
  })
}
export default msg
