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
   * 商品编号
   */
  productCode: string;

  /**
   * 商品名称
   */
  productName: string;

  /**
   * 类目名称
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
   * 外部编号
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

  /**
   * 库存数量
   */
  stockNum: number;

  /**
   * 盘点数量
   */
  takeNum: number;
}
