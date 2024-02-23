export interface ProductBundleBo {
  /**
   * ID
   */
  id: string;

  /**
   * 单品ID
   */
  productId: string;

  /**
   * 包含数量
   */
  bundleNum: number;

  /**
   * 销售价
   */
  salePrice: number;

  /**
   * 零售价
   */
  retailPrice: number;
}
