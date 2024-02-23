export interface ReturnProductVo {
  /**
   * 商品ID
   */
  productId: string;

  /**
   * 采购价
   */
  purchasePrice: number;

  /**
   * 退货数量
   */
  returnNum: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 收货单明细ID
   */
  receiveSheetDetailId: string;
}
