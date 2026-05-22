export interface ProductSalePropertyItemModelorBo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;
}

export interface ProductSalePropertyModelorBo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 可选项
   */
  items: ProductSalePropertyItemModelorBo[];
}
