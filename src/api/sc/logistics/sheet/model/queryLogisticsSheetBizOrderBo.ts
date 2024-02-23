export interface QueryLogisticsSheetBizOrderBo {
  /**
   * 业务单据ID
   */
  bizId: string;

  /**
   * 业务单据号
   */
  bizCode: string;

  /**
   * 业务类型
   */
  bizType: number;

  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 仓库名称
   */
  scName: string;

  /**
   * 收货人ID
   */
  receiverId: string;

  /**
   * 收货人姓名
   */
  receiverName: string;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建时间
   */
  createTime: string;
}
