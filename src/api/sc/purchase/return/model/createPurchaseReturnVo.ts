import { OrderPayTypeVo } from '@/api/sc/pay-type/model/orderPayTypeVo';
import { ReturnProductVo } from '@/api/sc/purchase/return/model/returnProductVo';

export interface CreatePurchaseReturnVo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 供应商ID
   */
  supplierId: string;

  /**
   * 采购员ID
   */
  purchaserId: string;

  /**
   * 付款日期
   */
  paymentDate: string;

  /**
   * 收货单ID
   */
  receiveSheetId: string;

  /**
   * 商品信息
   */
  products: ReturnProductVo[];

  /**
   * 支付方式
   */
  payTypes: OrderPayTypeVo[];

  /**
   * 备注
   */
  description: string;

  /**
   * 是否关联采购收货单
   */
  required: boolean;
}
