export interface GetCustomerSettlePreSheetBo {
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
   * 备注
   */
  description: string;

  /**
   * 创建人ID
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
   * 拒绝原因
   */
  refuseReason: string;

  /**
   * 明细
   */
  details: SheetDetailBo[];
}

export interface SheetDetailBo {
  /**
   * 明细ID
   */
  id: string;

  /**
   * 项目ID
   */
  itemId: string;

  /**
   * 项目名称
   */
  itemName: string;

  /**
   * 金额
   */
  amount: number;
}
