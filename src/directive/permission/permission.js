import { hasPermission } from '@/directive/permission/util'

function checkPermission(el, binding) {
  const { value } = binding
  const hp = hasPermission(value)
  if (!hp) {
    el.parentNode && el.parentNode.removeChild(el)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
