import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryStockCostAdjustSheetVo extends SortPageVo {
  /**
   * 业务单据号
   */
  code: string;

  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 状态
   */
  status: number;

  /**
   * 修改人
   */
  updateBy: string;

  /**
   * 修改时间 起始时间
   */
  updateTimeStart: string;

  /**
   * 修改时间 截止时间
   */
  updateTimeEnd: string;

  /**
   * 审核人
   */
  approveBy: string;

  /**
   * 审核时间 起始时间
   */
  approveTimeStart: string;

  /**
   * 审核时间 截止时间
   */
  approveTimeEnd: string;
}
