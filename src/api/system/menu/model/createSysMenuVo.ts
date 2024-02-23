export interface CreateSysMenuVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 标题
   */
  title: string;

  /**
   * 图标
   */
  icon: string;

  /**
   * 类型
   */
  display: number;

  /**
   * 父级ID
   */
  parentId: string;

  /**
   * 权限
   */
  permission: string;

  /**
   * 备注
   */
  description: string;

  /**
   * 路由名称
   */
  name: string;

  /**
   * 组件类型
   */
  componentType: number;

  /**
   * 组件
   */
  component: string;

  /**
   * 自定义请求参数
   */
  requestParam: string;

  /**
   * 路径
   */
  path: string;

  /**
   * 是否隐藏
   */
  hidden: boolean;

  /**
   * 是否不缓存
   */
  noCache: boolean;
}
