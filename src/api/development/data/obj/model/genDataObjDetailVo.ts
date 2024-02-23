export interface GenDataObjDetailVo {
  /**
   * ID
   */
  id: string;

  /**
   * 主表字段
   */
  mainTableDetailIds: string[];

  /**
   * 关联类型
   */
  relaType: number;

  /**
   * 关联方式
   */
  relaMode: number;

  /**
   * 子表ID
   */
  subTableId: string;

  /**
   * 子表别名
   */
  subTableAlias: string;

  /**
   * 子表字段
   */
  subTableDetailIds: string[];
}
