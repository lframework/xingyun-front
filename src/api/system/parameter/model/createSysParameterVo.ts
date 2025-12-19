export interface CreateSysParameterVo {
  /**
   * 租户ID
   */
  tenantId: number;

  /**
   * 键
   */
  pmKey: string;

  /**
   * 值
   */
  pmValue: string;

  /**
   * 备注
   */
  description: string;
}
