export interface QuerySysDataPermissionModelDetailBo {
  /**
   * ID
   */
  id: string;

  /**
   * 明细ID
   */
  detailId: number;

  /**
   * 节点类型
   */
  nodeType: number;

  /**
   * 计算类型
   */
  calcType: number;

  /**
   * 值
   */
  value: string;

  /**
   * 值
   */
  values: string[];

  /**
   * 名称
   */
  name: string;

  /**
   * 模型ID
   */
  modelId: number;

  /**
   * 条件
   */
  conditionTypes: number[];

  /**
   * 输入类型
   */
  inputType: number;

  /**
   * 条件类型
   */
  conditionType: number;

  /**
   * 前端枚举名
   */
  enumName: string;

  /**
   * 子节点
   */
  children: QuerySysDataPermissionModelDetailBo[];
}
