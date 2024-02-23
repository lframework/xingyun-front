import { SettlePreSheetItemVo } from '@/api/settle/pre/model/settlePreSheetItemVo';

export interface CreateSettlePreSheetVo {
  /**
   * 供应商ID
   */
  supplierId: string;

  /**
   * 项目
   */
  items: SettlePreSheetItemVo[];

  /**
   * 备注
   */
  description: string;
}
