import { PageVo } from '@/api/model/pageVo';

export interface PreTakeStockSheetSelectorVo extends PageVo {
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
   * 修改时间 起始时间
   */
  updateTimeStart: string;

  /**
   * 修改时间 截止时间
   */
  updateTimeEnd: string;
}
