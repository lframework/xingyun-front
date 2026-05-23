export interface StockAdjustProductVo {
  /**
   * 商品ID
   */
  productId: string;

  /**
   * SKU ID
   */
  skuId: string;

  /**
   * 调整库存数量
   */
  stockNum: number;

  /**
   * 备注
   */
  description: string;
}
