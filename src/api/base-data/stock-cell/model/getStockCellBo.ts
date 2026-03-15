export interface GetStockCellBo {
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
   * 仓位类别
   */
  cellType: number;

  /**
   * 备注
   */
  description: string;
}
