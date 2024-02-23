export interface QueryPreTakeStockSheetBo {
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

  /**
   * 修改人
   */
  updateBy: string;

  /**
   * 备注
   */
  description: string;
}
