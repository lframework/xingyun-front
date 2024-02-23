import { OrderPayTypeVo } from '@/api/sc/pay-type/model/orderPayTypeVo';
import { RetailOutProductVo } from '@/api/sc/retail/out/model/retailOutProductVo';

export interface CreateRetailOutSheetVo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 会员ID
   */
  memberId: string;

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
  products: RetailOutProductVo[];

  /**
   * 支付方式
   */
  payTypes: OrderPayTypeVo[];

  /**
   * 备注
   */
  description: string;
}
