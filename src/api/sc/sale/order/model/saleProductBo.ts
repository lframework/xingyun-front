export interface SaleProductBo {
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
   * 类目名称
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
   * 销售价
   */
  salePrice: number;

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
