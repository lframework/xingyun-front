import { ReceiveScTransferProductVo } from '@/api/sc/stock/transfer-sc/model/receiveScTransferProductVo';

export interface ReceiveScTransferOrderVo {
  /**
   * ID
   */
  id: string;

  /**
   * 收货商品
   */
  products: ReceiveScTransferProductVo[];
}
