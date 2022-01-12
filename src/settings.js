module.exports = {

  /**
   * 标题
   */
  title: '星云ERP',

  /**
   * 副标题
   */
  subTitle: '开好店，选星云',

  /**
   * LOGO地址
   */
  logo: 'https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png',

  /**
   * 描述
   */
  description: '解决开店难、管理难问题，助力业绩提高，驱动数字化升级',

  /**
   * 是否显示配置
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

  /**
   * 是否显示页签
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * 是否固定头部
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * 是否显示左侧栏顶部logo
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',

  /**
   * axios超时时间 单位：毫秒
   */
  timeout: 10000,

  /**
   * Token在Header中的Key值
   */
  tokenKey: 'X-Auth-Token'
}
