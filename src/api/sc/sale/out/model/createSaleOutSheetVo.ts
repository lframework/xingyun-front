import { SaleOutProductVo } from '@/api/sc/sale/out/model/saleOutProductVo';

export interface CreateSaleOutSheetVo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 客户ID
   */
  customerId: string;

  /**
   * 销售员ID
   */
  salerId: string;

  /**
   * 付款日期
   */
  paymentDate: string;

  /**
   * 是否允许修改付款日期
   */
  allowModifyPaymentDate: boolean;

  /**
   * 商品信息
   */
  products: SaleOutProductVo[];

  /**
   * 备注
   */
  description: string;

  /**
   * 销售订单ID
   */
  saleOrderId: string;

  /**
   * 是否关联销售订单
   */
  required: boolean;
}
