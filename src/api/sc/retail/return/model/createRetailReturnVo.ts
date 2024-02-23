import { OrderPayTypeVo } from '@/api/sc/pay-type/model/orderPayTypeVo';
import { RetailReturnProductVo } from '@/api/sc/retail/return/model/retailReturnProductVo';

export interface CreateRetailReturnVo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 会员ID
   */
  memberId: string;

  /**
   * 采购员ID
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
   * 收货单ID
   */
  outSheetId: string;

  /**
   * 商品信息
   */
  products: RetailReturnProductVo[];

  /**
   * 支付方式
   */
  payTypes: OrderPayTypeVo[];

  /**
   * 备注
   */
  description: string;

  /**
   * 是否关联零售出库单
   */
  required: boolean;
}
