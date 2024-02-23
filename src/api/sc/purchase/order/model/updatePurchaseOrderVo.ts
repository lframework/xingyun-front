import { CreatePurchaseOrderVo } from '@/api/sc/purchase/order/model/createPurchaseOrderVo';

export interface UpdatePurchaseOrderVo extends CreatePurchaseOrderVo {
  /**
   * 订单ID
   */
  id: string;
}
