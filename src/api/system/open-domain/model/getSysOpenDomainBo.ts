export interface GetSysOpenDomainBo {
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
   * 租户ID
   */
  tenantId: number;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 备注
   */
  description: string;
}
