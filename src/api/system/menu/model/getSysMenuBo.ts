export interface GetSysMenuBo {

  /**
   * ID
   */
  id: string;

  /**
   * 编号
   */
  code: string;

  /**
   * 名称（前端使用）
   */
  name: string;

  /**
   * 标题
   */
  title: string;

  /**
   * 图标
   */
  icon: string;

  /**
   * 组件类型（前端使用）
   */
  componentType: number;

  /**
   * 组件（前端使用）
   */
  component: string;

  /**
   * 自定义列表ID
   */
  customListId: string;

  /**
   * 自定义列表名称
   */
  customListName: string;

  /**
   * 自定义表单ID
   */
  customFormId: string;

  /**
   * 自定义表单名称
   */
  customFormName: string;

  /**
   * 自定义请求参数
   */
  requestParam: string;

  /**
   * 自定义页面ID
   */
  customPageId: string;

  /**
   * 父级ID
   */
  parentId: string;

  /**
   * 父级名称
   */
  parentName: string;

  /**
   * 路由路径（前端使用）
   */
  path: string;

  /**
   * 是否缓存（前端使用）
   */
  noCache: boolean;

  /**
   * 类型 0-目录 1-菜单 2-功能
   */
  display: number;

  /**
   * 是否隐藏（前端使用）
   */
  hidden: boolean;

  /**
   * 权限
   */
  permission: string;

  /**
   * 是否特殊菜单
   */
  isSpecial: boolean;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 备注
   */
  description: string;
}
