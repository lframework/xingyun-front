import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryTakeStockPlanVo extends SortPageVo {
  /**
   * 业务单据号
   */
  code: string;

  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 盘点状态
   */
  takeStatus: number;

  /**
   * 创建人ID
   */
  createBy: string;

  /**
   * 创建时间 起始时间
   */
  createTimeStart: string;

  /**
   * 创建时间 截止时间
   */
  createTimeEnd: string;

  /**
   * 修改人ID
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
}
