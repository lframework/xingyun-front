export interface ProductSelectorBo {
  /**
   * ID
   */
  id: string;

  /**
   * SKU ID
   */
  skuId: string;

  /**
   * SKU编号
   */
  skuCode: string;

  /**
   * 编号
   */
  code: string;

  /**
   * 商品ID
   */
  productId: string;

  /**
   * 商品编号
   */
  productCode: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 商品名称
   */
  productName: string;

  /**
   * 销售属性
   */
  salePropertyText: string;

  /**
   * 分类ID
   */
  categoryId: string;

  /**
   * 分类名称
   */
  categoryName: string;

  /**
   * 品牌ID
   */
  brandId: string;

  /**
   * 品牌名称
   */
  brandName: string;

  /**
   * 规格
   */
  spec: string;

  /**
   * 单位
   */
  unit: string;

  /**
   * 商品类型
   */
  productType: number;

  /**
   * 状态
   */
  available: boolean;
}
