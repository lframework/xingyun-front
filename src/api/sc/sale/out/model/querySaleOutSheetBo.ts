export interface QuerySaleOutSheetBo {
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
   * 客户编号
   */
  customerCode: string;

  /**
   * 客户名称
   */
  customerName: string;

  /**
   * 销售员姓名
   */
  salerName: string;

  /**
   * 销售订单ID
   */
  saleOrderId: string;

  /**
   * 销售订单号
   */
  saleOrderCode: string;

  /**
   * 销售数量
   */
  totalNum: number;

  /**
   * 赠品数量
   */
  totalGiftNum: number;

  /**
   * 销售金额
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
