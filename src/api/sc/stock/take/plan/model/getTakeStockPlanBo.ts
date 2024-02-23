export interface GetTakeStockPlanBo {
  /**
   * ID
   */
  id: string;

  /**
   * 业务单据号
   */
  code: string;

  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 仓库名称
   */
  scName: string;

  /**
   * 盘点类别
   */
  takeType: number;

  /**
   * 盘点状态
   */
  takeStatus: number;

  /**
   * 业务名称
   */
  bizName: string;
}
