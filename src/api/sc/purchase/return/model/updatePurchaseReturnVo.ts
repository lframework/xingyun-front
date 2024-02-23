import { CreatePurchaseReturnVo } from '@/api/sc/purchase/return/model/createPurchaseReturnVo';

export interface UpdatePurchaseReturnVo extends CreatePurchaseReturnVo {
  /**
   * 退货单ID
   */
  id: string;
}
