export interface CreateProductStockWarningVo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * SKU ID
   */
  skuId: string;

  /**
   * 预警下限
   */
  minLimit: number;

  /**
   * 预警上限
   */
  maxLimit: number;
}
