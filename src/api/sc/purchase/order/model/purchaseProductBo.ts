export interface PurchaseProductBo {
  /**
   * ID
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
   * 是否多销售属性
   */
  multiSaleProp: boolean;

  /**
   * 规格
   */
  spec: string;

  /**
   * 单位
   */
  unit: string;

  /**
   * 采购价
   */
  purchasePrice: number;

  /**
   * 含税成本价
   */
  taxCostPrice: number;

  /**
   * 库存数量
   */
  stockNum: number;

  /**
   * 税率（%）
   */
  taxRate: number;

  /**
   * 仓库ID
   */
  scId: string;
}
