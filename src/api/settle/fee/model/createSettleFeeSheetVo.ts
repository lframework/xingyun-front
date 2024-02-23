import { SettleFeeSheetItemVo } from '@/api/settle/fee/model/settleFeeSheetItemVo';

export interface CreateSettleFeeSheetVo {
  /**
   * 备注
   */
  description: string;

  /**
   * 项目
   */
  items: SettleFeeSheetItemVo[];

  /**
   * 收支方式
   */
  sheetType: number;

  /**
   * 供应商ID
   */
  supplierId: string;
}
