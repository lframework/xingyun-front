export interface GetSettleCheckSheetBo {
  /**
   * ID
   */
  id: string;

  /**
   * 单号
   */
  code: string;

  /**
   * 供应商ID
   */
  supplierId: string;

  /**
   * 供应商编号
   */
  supplierCode: string;

  /**
   * 供应商名称
   */
  supplierName: string;

  /**
   * 总金额
   */
  totalAmount: number;

  /**
   * 应付金额
   */
  totalPayAmount: number;

  /**
   * 已付金额
   */
  totalPayedAmount: number;

  /**
   * 优惠金额
   */
  totalDiscountAmount: number;

  /**
   * 未付金额
   */
  totalUnPayAmount: number;

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
   * 单据ID
   */
  bizId: string;

  /**
   * 单据号
   */
  bizCode: string;

  /**
   * 业务类型
   */
  bizType: number;

  /**
   * 计算类型
   */
  calcType: number;

  /**
   * 审核时间
   */
  approveTime: string;

  /**
   * 单据金额
   */
  totalAmount: number;

  /**
   * 应付金额
   */
  payAmount: number;

  /**
   * 单据备注
   */
  description: string;
}
