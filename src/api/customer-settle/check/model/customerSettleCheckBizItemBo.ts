export interface CustomerSettleCheckBizItemBo {
  /**
   * 单据ID
   */
  id: string;

  /**
   * 单据号
   */
  code: string;

  /**
   * 业务类型
   */
  bizType: number;

  /**
   * 计算类型
   */
  calcType: number;

  /**
   * 对账金额
   */
  totalAmount: number;

  /**
   * 审核时间
   */
  approveTime: string;
}
