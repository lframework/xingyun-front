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
   * 单品编号
   */
  productCode: string;

  /**
   * 单品名称
   */
  productName: string;

  /**
   * 单品SKU编号
   */
  skuCode: string;

  /**
   * 包含数量
   */
  bundleNum: number;

  /**
   * 采购价
   */
  purchasePrice: number;

  /**
   * 销售价
   */
  salePrice: number;

  /**
   * 零售价
   */
  retailPrice: number;
}
