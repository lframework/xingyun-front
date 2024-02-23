export interface QueryCustomerSettlePreSheetBo {
  /**
   * 审核人
   */
  approveBy: string;

  /**
   * 审核时间
   */
  approveTime: string;

  /**
   * 单号
   */
  code: string;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 客户编号
   */
  customerCode: string;

  /**
   * 客户ID
   */
  customerId: string;

  /**
   * 客户名称
   */
  customerName: string;

  /**
   * 备注
   */
  description: string;

  /**
   * ID
   */
  id: string;

  /**
   * 结算状态
   */
  settleStatus: number;

  /**
   * 状态
   */
  status: number;

  /**
   * 总金额
   */
  totalAmount: number;

}
