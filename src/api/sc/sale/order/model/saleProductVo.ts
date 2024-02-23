export interface SaleProductVo {
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
   * 销售数量
   */
  orderNum: number;

  /**
   * 备注
   */
  description: string;
}
