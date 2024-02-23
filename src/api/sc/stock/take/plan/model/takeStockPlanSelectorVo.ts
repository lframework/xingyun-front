import { PageVo } from '@/api/model/pageVo';

export interface TakeStockPlanSelectorVo extends PageVo {
  /**
   * 业务单据号
   */
  code: string;

  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 是否正在进行盘点
   */
  taking: boolean;

  /**
   * 盘点类别
   */
  takeType: number;

  /**
   * 盘点状态
   */
  takeStatus: number;

  /**
   * 创建时间 起始时间
   */
  createTimeStart: string;

  /**
   * 创建时间 截止时间
   */
  createTimeEnd: string;

  /**
   * 修改时间 起始时间
   */
  updateTimeStart: string;

  /**
   * 修改时间 截止时间
   */
  updateTimeEnd: string;
}
