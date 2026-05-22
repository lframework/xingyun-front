export interface QueryProductSalePropertyBo {
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
   * 已关联商品分类数量
   */
  categoryCount: number;

  /**
   * 备注
   */
  description: string;
}
