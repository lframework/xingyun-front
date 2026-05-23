export interface TakeStockSheetProductVo {
  /**
   * 商品ID
   */
  productId: string;

  /**
   * SKU ID
   */
  skuId: string;

  /**
   * 盘点数量
   */
  takeNum: number;

  /**
   * 备注
   */
  description: string;
}
