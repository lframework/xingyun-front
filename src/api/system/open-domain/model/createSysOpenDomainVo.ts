export interface CreateSysOpenDomainVo {
  /**
   * 名称
   */
  name: string;

  /**
   * API密钥
   */
  apiSecret: string;

  /**
   * 租户ID
   */
  tenantId: number;

  /**
   * 备注
   */
  description: string;
}
