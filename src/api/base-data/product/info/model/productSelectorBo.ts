export interface ProductSelectorBo {
  /**
   * ID
   */
  id: string;

  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * SKU
   */
  skuCode: string;

  /**
   * 简码
   */
  externalCode: string;

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
