export interface CustomerSettleSheetItemVo {
  /**
   * 单据ID
   */
  id: string;

  /**
   * 实收金额
   */
  payAmount: number;

  /**
   * 优惠金额
   */
  discountAmount: number;

  /**
   * 备注
   */
  description: string;
}
