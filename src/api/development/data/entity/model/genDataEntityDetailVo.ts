export interface GenDataEntityDetailVo {
  /**
   * ID
   */
  id: string;

  /**
   * 字段显示名称
   */
  name: string;

  /**
   * 数据类型
   */
  dataType: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 显示类型
   */
  viewType: number;

  /**
   * 是否内置枚举
   */
  fixEnum: boolean;

  /**
   * 后端枚举名
   */
  enumBack: string;

  /**
   * 前端枚举名
   */
  enumFront: string;

  /**
   * 正则表达式
   */
  regularExpression: string;

  /**
   * 是否排序字段
   */
  isOrder: boolean;

  /**
   * 排序类型
   */
  orderType: string;

  /**
   * 数据字典ID
   */
  dataDicId: string;

  /**
   * 自定义选择器ID
   */
  customSelectorId: string;

  /**
   * 长度
   */
  len: number;

  /**
   * 小数位数
   */
  decimals: number;
}
