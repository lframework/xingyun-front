import loading from './loading'
export default {
  install(Vue) {
    Vue.directive('loading', loading)
  }
}
