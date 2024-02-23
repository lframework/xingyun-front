export interface GetPaymentDateBo {
  /**
   * 是否允许修改付款日期
   */
  allowModify: boolean;

  /**
   * 默认付款日期
   */
  paymentDate: string;
}
