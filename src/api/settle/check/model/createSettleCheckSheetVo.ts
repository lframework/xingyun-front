import { SettleCheckSheetItemVo } from '@/api/settle/check/model/settleCheckSheetItemVo';

export interface CreateSettleCheckSheetVo {
  /**
   * 供应商ID
   */
  supplierId: string;

  /**
   * 项目
   */
  items: SettleCheckSheetItemVo[];

  /**
   * 起始日期
   */
  startDate: string;

  /**
   * 截止日期
   */
  endDate: string;

  /**
   * 备注
   */
  description: string;
}
