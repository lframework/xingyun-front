import { CustomerSettleCheckSheetItemVo } from '@/api/customer-settle/check/model/customerSettleCheckSheetItemVo';

export interface CreateCustomerSettleCheckSheetVo {
  /**
   * 客户ID
   */
  customerId: string;

  /**
   * 项目
   */
  items: CustomerSettleCheckSheetItemVo[];

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
