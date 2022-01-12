const instance = {}
instance.install = function(Vue, options = {}) {
  Vue.prototype.$api = options
}

export default instance
