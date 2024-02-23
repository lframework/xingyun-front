import { CustomerSettleSheetItemVo } from '@/api/customer-settle/sheet/model/customerSettleSheetItemVo';

export interface CreateCustomerSettleSheetVo {
  /**
   * 客户ID
   */
  customerId: string;

  /**
   * 项目
   */
  items: CustomerSettleSheetItemVo[];

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
