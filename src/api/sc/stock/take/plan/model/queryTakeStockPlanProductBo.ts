export interface QueryTakeStockPlanProductBo {
  /**
   * 商品ID
   */
  productId: string;

  /**
   * SKU ID
   */
  skuId: string;

  /**
   * SKU编号
   */
  skuCode: string;

  /**
   * 销售属性
   */
  salePropertyText: string;

  /**
   * 商品编号
   */
  productCode: string;

  /**
   * 商品名称
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
   * 规格
   */
  spec: string;

  /**
   * 单位
   */
  unit: string;

  /**
   * 初始库存
   */
  stockNum: number;
}
