import { CustomerSettleFeeSheetItemVo } from '@/api/customer-settle/fee/model/customerSettleFeeSheetItemVo';

export interface CreateCustomerSettleFeeSheetVo {
  /**
   * 客户ID
   */
  customerId: string;

  /**
   * 收支方式
   */
  sheetType: number;

  /**
   * 项目
   */
  items: CustomerSettleFeeSheetItemVo[];

  /**
   * 备注
   */
  description: string;
}
