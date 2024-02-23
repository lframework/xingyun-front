export interface PreTakeStockSheetSelectorBo {
  /**
   * ID
   */
  id: string;

  /**
   * 业务单据号
   */
  code: string;

  /**
   * 仓库编号
   */
  scCode: string;

  /**
   * 仓库名称
   */
  scName: string;

  /**
   * 盘点状态
   */
  takeStatus: number;

  /**
   * 修改时间
   */
  updateTime: string;
}
