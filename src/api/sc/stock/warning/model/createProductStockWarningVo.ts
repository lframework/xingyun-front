export interface CreateProductStockWarningVo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 商品ID
   */
  productId: string;

  /**
   * 预警下限
   */
  minLimit: number;

  /**
   * 预警上限
   */
  maxLimit: number;
}
