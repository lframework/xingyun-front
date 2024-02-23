export interface CustomerSettleCheckSheetItemVo {
  /**
   * 单据ID
   */
  id: string;

  /**
   * 业务类型
   */
  bizType: number;

  /**
   * 应收金额
   */
  payAmount: number;

  /**
   * 备注
   */
  description: string;
}
