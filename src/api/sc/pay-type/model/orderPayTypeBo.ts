export interface OrderPayTypeBo {
  /**
   * ID
   */
  id: string;

  /**
   * 订单ID
   */
  orderId: string;

  /**
   * 支付方式ID
   */
  payTypeId: string;

  /**
   * 支付金额
   */
  payAmount: number;

  /**
   * 支付内容
   */
  text: string;

  /**
   * 是否记录内容
   */
  recText: boolean;
}
