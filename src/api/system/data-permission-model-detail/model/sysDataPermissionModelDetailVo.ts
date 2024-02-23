export interface SysDataPermissionModelDetailVo {
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
   * 条件类型
   */
  conditionType: number;

  /**
   * 子节点
   */
  children: SysDataPermissionModelDetailVo[];
}
