export interface QueryRetailReturnBo {
  /**
   * ID
   */
  id: string;

  /**
   * 单号
   */
  code: string;

  /**
   * 仓库编号
   */
  scCode: string;

  /**
   * 仓库名称
   */
  scName: string;

  /**
   * 会员编号
   */
  memberCode: string;

  /**
   * 会员名称
   */
  memberName: string;

  /**
   * 销售员姓名
   */
  salerName: string;

  /**
   * 销售出库单ID
   */
  outSheetId: string;

  /**
   * 销售出库单号
   */
  outSheetCode: string;

  /**
   * 退货数量
   */
  totalNum: number;

  /**
   * 赠品数量
   */
  totalGiftNum: number;

  /**
   * 退货金额
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
   * 拒绝原因
   */
  refuseReason: string;

  /**
   * 结算状态
   */
  settleStatus: number;
}
