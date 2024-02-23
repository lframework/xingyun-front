export interface SettleSheetItemVo {
  /**
   * 单据ID
   */
  id: string;

  /**
   * 实付金额
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
