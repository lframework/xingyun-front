export interface QueryCustomerSettleSheetBo {
  /**
   * ID
   */
  id: string;

  /**
   * 单号
   */
  code: string;

  /**
   * 客户ID
   */
  customerId: string;

  /**
   * 客户编号
   */
  customerCode: string;

  /**
   * 客户名称
   */
  customerName: string;

  /**
   * 总金额
   */
  totalAmount: number;

  /**
   * 优惠金额
   */
  totalDiscountAmount: number;

  /**
   * 起始时间
   */
  startTime: string;

  /**
   * 截止时间
   */
  endTime: string;

  /**
   * 备注
   */
  description: string;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 审核人
   */
  approveBy: string;

  /**
   * 审核时间
   */
  approveTime: string;

  /**
   * 状态
   */
  status: number;
}
