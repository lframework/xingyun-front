import { ReceiveProductVo } from '@/api/sc/purchase/receive/model/receiveProductVo';

export interface CreateReceiveSheetVo {
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
   * 是否允许修改付款日期
   */
  allowModifyPaymentDate: boolean;

  /**
   * 到货日期
   */
  receiveDate: string;

  /**
   * 采购订单ID
   */
  purchaseOrderId: string;

  /**
   * 商品信息
   */
  products: ReceiveProductVo[];

  /**
   * 备注
   */
  description: string;

  /**
   * 是否关联采购订单
   */
  required: boolean;
}
