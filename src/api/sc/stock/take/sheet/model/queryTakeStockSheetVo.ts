import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryTakeStockSheetVo extends SortPageVo {
  /**
   * 业务单据号
   */
  code: string;

  /**
   * 盘点任务ID
   */
  planId: string;

  /**
   * 预先盘点单ID
   */
  preSheetId: string;

  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 盘点状态
   */
  takeStatus: number;

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
