import { CreateSaleOrderVo } from '@/api/sc/sale/order/model/createSaleOrderVo';

export interface UpdateSaleOrderVo extends CreateSaleOrderVo {
  /**
   * 订单ID
   */
  id: string;
}
