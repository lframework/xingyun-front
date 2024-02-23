export interface QueryProductPropertyBo {
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
   * 是否必填
   */
  isRequired: boolean;

  /**
   * 录入类型
   */
  columnType: number;

  /**
   * 属性类别
   */
  propertyType: number;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 备注
   */
  description: string;
}
