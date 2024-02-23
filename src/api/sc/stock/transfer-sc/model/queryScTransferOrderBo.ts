export interface QueryScTransferOrderBo {
  /**
   * ID
   */
  id: string;

  /**
   * 业务单据号
   */
  code: string;

  /**
   * 转出仓库编号
   */
  sourceScCode: string;

  /**
   * 转出仓库名称
   */
  sourceScName: string;

  /**
   * 转入仓库编号
   */
  targetScCode: string;

  /**
   * 转入仓库名称
   */
  targetScName: string;

  /**
   * 调拨数量
   */
  totalNum: number;

  /**
   * 调拨成本金额
   */
  totalAmount: number;

  /**
   * 状态
   */
  status: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 修改人
   */
  updateBy: string;

  /**
   * 修改时间
   */
  updateTime: string;

  /**
   * 审核人
   */
  approveBy: string;

  /**
   * 审核时间
   */
  approveTime: string;
}
