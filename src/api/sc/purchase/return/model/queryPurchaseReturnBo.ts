export interface QueryPurchaseReturnBo {
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
   * 供应商编号
   */
  supplierCode: string;

  /**
   * 供应商名称
   */
  supplierName: string;

  /**
   * 采购员姓名
   */
  purchaserName: string;

  /**
   * 采购收货单ID
   */
  receiveSheetId: string;

  /**
   * 采购收货单号
   */
  receiveSheetCode: string;

  /**
   * 采购数量
   */
  totalNum: number;

  /**
   * 赠品数量
   */
  totalGiftNum: number;

  /**
   * 采购金额
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
