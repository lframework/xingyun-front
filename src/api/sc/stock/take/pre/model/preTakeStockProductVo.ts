export interface PreTakeStockProductVo {
  /**
   * 商品ID
   */
  productId: string;

  /**
   * SKU ID
   */
  skuId: string;

  /**
   * 初盘数量
   */
  firstNum: number;

  /**
   * 复盘数量
   */
  secondNum: number;

  /**
   * 抽盘数量
   */
  randNum: number;
}
