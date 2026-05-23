export interface ScTransferProductBo {
  /**
   * ID
   */
  productId: string;

  /**
   * SKU ID
   */
  skuId: string;

  /**
   * 编号
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
   * 规格
   */
  spec: string;

  /**
   * 单位
   */
  unit: string;

  /**
   * 当前库存数量
   */
  curStockNum: number;
}
