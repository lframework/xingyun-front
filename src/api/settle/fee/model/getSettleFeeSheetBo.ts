export interface GetSettleFeeSheetBo {
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
   *
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
