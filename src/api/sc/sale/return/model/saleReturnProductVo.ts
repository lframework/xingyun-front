export interface SaleReturnProductVo {
  /**
   * 商品ID
   */
  productId: string;

  /**
   * 原价
   */
  oriPrice: number;

  /**
   * 现价
   */
  taxPrice: number;

  /**
   * 折扣（%）
   */
  discountRate: number;

  /**
   * 退货数量
   */
  returnNum: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 出库单明细ID
   */
  outSheetDetailId: string;
}
