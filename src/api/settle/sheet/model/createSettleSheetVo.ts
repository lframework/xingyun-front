import { SettleSheetItemVo } from '@/api/settle/sheet/model/settleSheetItemVo';

export interface CreateSettleSheetVo {
  /**
   * 供应商ID
   */
  supplierId: string;

  /**
   * 项目
   */
  items: SettleSheetItemVo[];

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
