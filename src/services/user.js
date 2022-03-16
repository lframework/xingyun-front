import Vue from 'vue'
import { removeAuthorization } from '@/utils/request'

/**
 * 退出登录
 */
export function logout() {
  Vue.prototype.$api.user.logout().then(() => {
    removeUserInfo()
  })
}

export function removeUserInfo() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}

export default {
  logout
}
