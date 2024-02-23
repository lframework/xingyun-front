export interface ProductPropertyModelorBo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 是否必填
   */
  isRequired: boolean;

  /**
   * 可选项，当columnType != CUSTOM时 不为空
   */
  items: list;

  /**
   * 显示值 当columnType != CUSTOM时，此值为items项ID 当columnType == CUSTOM时，此值为录入值
   */
  text: string;

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
}
