import { SaleReturnProductVo } from '@/api/sc/sale/return/model/saleReturnProductVo';

export interface CreateSaleReturnVo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 客户ID
   */
  customerId: string;

  /**
   * 采购员ID
   */
  salerId: string;

  /**
   * 付款日期
   */
  paymentDate: string;

  /**
   * 收货单ID
   */
  outSheetId: string;

  /**
   * 商品信息
   */
  products: SaleReturnProductVo[];

  /**
   * 备注
   */
  description: string;

  /**
   * 是否关联销售出库单
   */
  required: boolean;
}
