export interface CreateTakeStockPlanVo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 盘点类别
   */
  takeType: number;

  /**
   * 业务ID
   */
  bizIds: string[];

  /**
   * 备注
   */
  description: string;
}
