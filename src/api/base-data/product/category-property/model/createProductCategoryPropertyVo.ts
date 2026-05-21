export interface CreateProductCategoryPropertyVo {
  /**
   * 分类ID
   */
  categoryId: string;

  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 是否必填
   */
  isRequired: boolean;

  /**
   * 录入类型
   */
  columnType: number;

  /**
   * 备注
   */
  description: string;
}
