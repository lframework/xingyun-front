import store from '@/store'
import utils from '@/utils/utils'

function checkNoPermission(el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters['account/roles']

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const isAdmin = roles.includes('admin')
      if (isAdmin) {
        el.parentNode && el.parentNode.removeChild(el)
        return
      }

      const hasPermission = permissionRoles.some(pattern => {
        return roles.some(item => {
          return utils.strMatch(item, pattern)
        })
      })

      if (hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkNoPermission(el, binding)
  },
  update(el, binding) {
    checkNoPermission(el, binding)
  }
}
