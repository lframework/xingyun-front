export interface ProductSkuVo {
  /**
   * SKU ID
   */
  id: string;

  /**
   * SKU编号
   */
  code: string;

  /**
   * 扩展编号
   */
  multiCodes: string[];

  /**
   * SKU主图
   */
  mainImage?: string;

  /**
   * 销售属性
   */
  saleProperties?: ProductSkuSalePropertyVo[];

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

export interface ProductSkuSalePropertyVo {
  /**
   * 销售属性ID
   */
  propertyId: string;

  /**
   * 销售属性值ID
   */
  propertyItemId: string;
}
