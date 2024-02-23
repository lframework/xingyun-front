export interface CreateProductPropertyVo {
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
   * 数据类型
   */
  columnDataType: number;

  /**
   * 属性类别
   */
  propertyType: number;

  /**
   * 类目ID
   */
  categoryIds: string[];

  /**
   * 备注
   */
  description: string;
}
