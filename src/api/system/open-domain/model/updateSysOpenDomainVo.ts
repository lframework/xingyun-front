export interface UpdateSysOpenDomainVo {
  /**
   * ID
   */
  id: number;

  /**
   * 名称
   */
  name: string;

  /**
   * 租户ID
   */
  tenantId: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 状态
   */
  available: boolean;
}
