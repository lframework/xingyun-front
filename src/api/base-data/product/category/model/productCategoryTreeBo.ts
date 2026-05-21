export interface ProductCategoryTreeBo {
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
   * 父级ID
   */
  parentId: string;

  /**
   * 备注
   */
  description: string;

  /**
   * 是否已配置商品属性
   */
  hasProperty: boolean;
}
