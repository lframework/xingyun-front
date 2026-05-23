export interface ProductSkuBo {
  /**
   * SKU ID
   */
  id: string;

  /**
   * 商品ID
   */
  productId: string;

  /**
   * SKU编号
   */
  code: string;

  /**
   * 是否一品多码
   */
  multiCode: boolean;

  /**
   * 销售属性
   */
  salePropertyText: string;

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
  saleProperties: ProductSkuSalePropertyBo[];

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

export interface ProductSkuSalePropertyBo {
  /**
   * 销售属性ID
   */
  propertyId: string;

  /**
   * 销售属性名称
   */
  propertyName: string;

  /**
   * 销售属性值ID
   */
  propertyItemId: string;

  /**
   * 销售属性值名称
   */
  propertyItemName: string;
}
