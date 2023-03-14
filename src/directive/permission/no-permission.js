import { hasPermission } from '@/directive/permission/util'

function checkNoPermission(el, binding) {
  const { value } = binding
  const hp = hasPermission(value)

  if (hp) {
    el.parentNode && el.parentNode.removeChild(el)
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
