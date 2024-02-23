import { CustomerSettlePreSheetItemVo } from '@/api/customer-settle/pre/model/customerSettlePreSheetItemVo';

export interface CreateCustomerSettlePreSheetVo {
  /**
   * 客户ID
   */
  customerId: string;

  /**
   * 项目
   */
  items: CustomerSettlePreSheetItemVo[];

  /**
   * 备注
   */
  description: string;
}
