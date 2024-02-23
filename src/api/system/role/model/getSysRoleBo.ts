export interface GetSysRoleBo {
  /**
   * ID
   */
  id: string;

  /**
   * 岗位编号
   */
  code: string;

  /**
   * 岗位名称
   */
  name: string;

  /**
   * 权限
   */
  permission: string;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 备注
   */
  description: string;
}
