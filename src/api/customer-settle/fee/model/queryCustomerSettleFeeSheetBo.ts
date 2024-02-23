export interface QueryCustomerSettleFeeSheetBo {
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
   * 单据类型
   */
  sheetType: number;

  /**
   * 总金额
   */
  totalAmount: number;

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

  /**
   * 结算状态
   */
  settleStatus: number;
}
