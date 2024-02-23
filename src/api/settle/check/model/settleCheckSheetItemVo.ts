export interface SettleCheckSheetItemVo {
  /**
   * 单据ID
   */
  id: string;

  /**
   * 业务类型
   */
  bizType: number;

  /**
   * 应付金额
   */
  payAmount: number;

  /**
   * 备注
   */
  description: string;
}
