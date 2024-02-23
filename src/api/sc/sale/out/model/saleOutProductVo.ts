export interface SaleOutProductVo {
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
   * 出库数量
   */
  orderNum: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 销售订单明细ID
   */
  saleOrderDetailId: string;
}
