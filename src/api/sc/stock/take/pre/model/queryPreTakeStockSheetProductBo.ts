export interface QueryPreTakeStockSheetProductBo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 商品ID
   */
  productId: string;

  /**
   * SKU ID
   */
  skuId: string;

  /**
   * 商品编号
   */
  productCode: string;

  /**
   * SKU编号
   */
  skuCode: string;

  /**
   * 销售属性
   */
  salePropertyText: string;

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
   * 库存数量
   */
  stockNum: number;

  /**
   * 盘点数量
   */
  takeNum: number;
}
