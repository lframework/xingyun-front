export interface TenantRequireBo {
  /**
   * 是否开启多租户
   */
  enable: boolean;
  /**
   * 当前租户ID
   */
  tenantId: number;
}
