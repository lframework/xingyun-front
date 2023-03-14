import store from '@/store'
import utils from '@/utils/utils'

export function hasPermission(value) {
  const roles = store.getters && store.getters['account/roles']

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const isAdmin = roles.includes('admin')
      if (isAdmin) {
        return true
      }

      const hp = permissionRoles.some(pattern => {
        return roles.some(item => {
          return utils.strMatch(item, pattern)
        })
      })

      return hp
    }
  } else {
    return false
  }
}
