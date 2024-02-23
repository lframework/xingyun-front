export interface GenDataObjColumnBo {
  /**
   * ID
   */
  id: string;

  /**
   * 数据对象名称
   */
  name: string;

  /**
   * 列
   */
  columns: ColumnBo[];
}

export interface ColumnBo {
  /**
   * 数据实体明细ID
   */
  id: string;

  /**
   * 关联ID
   */
  relaId: string;

  /**
   * 显示名称
   */
  name: string;

  /**
   * 类型
   */
  type: number;

  /**
   * 数据对象
   */
  dataType: number;

  /**
   * 显示类型
   */
  viewType: number;
}
