export interface CreateSysDataPermissionDataVo {
  /**
   * 业务ID
   */
  bizIds: string[];

  /**
   * 业务类型
   */
  bizType: number;

  /**
   * 权限类型
   */
  permissionType: number;

  /**
   * 权限
   */
  permission: string;
}
