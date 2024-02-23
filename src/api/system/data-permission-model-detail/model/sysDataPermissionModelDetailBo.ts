export interface SysDataPermissionModelDetailBo {
  /**
   * ID
   */
  id: number;

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
  conditionTypes: string[];

  /**
   * 输入类型
   */
  inputType: number;

  /**
   * 前端枚举名
   */
  enumName: string;
}
