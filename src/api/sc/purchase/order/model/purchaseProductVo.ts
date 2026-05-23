export interface PurchaseProductVo {
  /**
   * 商品ID
   */
  productId: string;

  /**
   * SKU ID
   */
  skuId: string;

  /**
   * 采购价
   */
  purchasePrice: number;

  /**
   * 采购数量
   */
  purchaseNum: number;

  /**
   * 备注
   */
  description: string;
}
