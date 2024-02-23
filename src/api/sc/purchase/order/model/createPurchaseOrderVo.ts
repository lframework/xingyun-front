import { OrderPayTypeVo } from '@/api/sc/pay-type/model/orderPayTypeVo';
import { PurchaseProductVo } from '@/api/sc/purchase/order/model/purchaseProductVo';

export interface CreatePurchaseOrderVo {
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
   * 预计到货日期
   */
  expectArriveDate: string;

  /**
   * 商品信息
   */
  products: PurchaseProductVo[];

  /**
   * 约定支付
   */
  payTypes: OrderPayTypeVo[];

  /**
   * 备注
   */
  description: string;
}
