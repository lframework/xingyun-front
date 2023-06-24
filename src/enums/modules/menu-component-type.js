/**
 * 菜单组件类型
 * @type {{CUSTOM_LIST: {code: number, desc: string}, NORMAL: {code: number, desc: string}}}
 */
const MENU_COMPONENT_TYPE = {
  NORMAL: {
    code: 0,
    desc: '普通'
  },
  CUSTOM_LIST: {
    code: 1,
    desc: '自定义列表'
  },
  CUSTOM_FORM: {
    code: 2,
    desc: '自定义表单'
  },
  CUSTOM_PAGE: {
    code: 3,
    desc: '自定义页面'
  }
}

export default MENU_COMPONENT_TYPE
