export interface QuerySysOpenDomainBo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * API密钥
   */
  apiSecret: string;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 租户ID
   */
  tenantId: number;

  /**
   * 备注
   */
  description: string;
}
