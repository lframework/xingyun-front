export interface QueryStockAdjustSheetBo {
  /**
   * ID
   */
  id: string;

  /**
   * 业务单据号
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
   * 业务类型
   */
  bizType: number;

  /**
   * 调整原因
   */
  reasonName: string;

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
