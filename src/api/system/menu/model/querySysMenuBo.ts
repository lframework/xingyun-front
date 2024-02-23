export interface QuerySysMenuBo {
  /**
   * ID
   */
  id: string;

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
   * 父级ID
   */
  parentId: string;
  /**
   * 类型
   */
  display: number;
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
