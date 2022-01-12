/**
 * 菜单类型
 * @type {{PERMISSION: {value: number, desc: string}, CATALOG: {value: number, desc: string}, FUNCTION: {value: number, desc: string}}}
 */
const MENU_DISPLAY = {
  CATALOG: {
    code: 0,
    desc: '目录'
  },
  FUNCTION: {
    code: 1,
    desc: '功能'
  },
  PERMISSION: {
    code: 2,
    desc: '权限'
  }
}

export default MENU_DISPLAY
