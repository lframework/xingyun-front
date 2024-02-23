export interface TakeStockSheetFullBo {
  /**
   * ID
   */
  id: string;

  /**
   * 业务单据号
   */
  code: string;

  /**
   * 盘点任务ID
   */
  planId: string;

  /**
   * 盘点任务号
   */
  planCode: string;

  /**
   * 预先盘点单ID
   */
  preSheetId: string;

  /**
   * 预先盘点单号
   */
  preSheetCode: string;

  /**
   * 仓库名称
   */
  scName: string;

  /**
   * 盘点任务-盘点类别
   */
  takeType: number;

  /**
   * 业务名称
   */
  bizName: string;

  /**
   * 盘点任务-盘点状态
   */
  takeStatus: number;

  /**
   * 状态
   */
  status: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 拒绝理由
   */
  refuseReason: string;

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

  /**
   * 明细
   */
  details: SheetDetailBo[];
}

export interface SheetDetailBo {
  /**
   * ID
   */
  productId: string;

  /**
   * 编号
   */
  productCode: string;

  /**
   * 名称
   */
  productName: string;

  /**
   * 类目名称
   */
  categoryName: string;

  /**
   * 品牌名称
   */
  brandName: string;

  /**
   * SKU
   */
  skuCode: string;

  /**
   * 外部编号
   */
  externalCode: string;

  /**
   * 规格
   */
  spec: string;

  /**
   * 单位
   */
  unit: string;

  /**
   * 库存数量
   */
  stockNum: number;

  /**
   * 盘点数量
   */
  takeNum: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 盘点任务ID
   */
  planId: string;
}
