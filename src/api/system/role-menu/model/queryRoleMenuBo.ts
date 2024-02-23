export interface QueryRoleMenuBo {
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
   * 状态
   */
  available: boolean;

  /**
   * 是否选择
   */
  selected: boolean;
}
