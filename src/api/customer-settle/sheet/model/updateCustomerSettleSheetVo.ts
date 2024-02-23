import { CreateCustomerSettleSheetVo } from '@/api/customer-settle/sheet/model/createCustomerSettleSheetVo';

export interface UpdateCustomerSettleSheetVo extends CreateCustomerSettleSheetVo {
  /**
   * ID
   */
  id: string;
}
