export interface PreTakeStockProductBo {
  /**
   * ID
   */
  productId: string;

  /**
   * 编号
   */
  productCode: string;

  /**
   * 名称
   */
  productName: string;

  /**
   * 分类名称
   */
  categoryName: string;

  /**
   * 品牌名称
   */
  brandName: string;

  /**
   * SKU
   */
  skuCode: string;

  /**
   * 简码
   */
  externalCode: string;

  /**
   * 规格
   */
  spec: string;

  /**
   * 单位
   */
  unit: string;
}
