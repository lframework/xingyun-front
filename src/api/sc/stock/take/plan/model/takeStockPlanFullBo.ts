export interface TakeStockPlanFullBo {
  /**
   * ID
   */
  id: string;

  /**
   * 业务单据号
   */
  code: string;

  /**
   * 仓库名称
   */
  scName: string;

  /**
   * 盘点类别
   */
  takeType: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 盘点状态
   */
  takeStatus: number;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 修改人
   */
  updateBy: string;

  /**
   * 修改时间
   */
  updateTime: string;

  /**
   * 明细
   */
  details: DetailBo[];
}

export interface DetailBo {
  /**
   * 明细ID
   */
  id: string;

  /**
   * 商品ID
   */
  productId: string;

  /**
   * 商品编号
   */
  productCode: string;

  /**
   * 商品名称
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
   * 原盘点数量（通过盘点单统计）
   */
  oriTakeNum: number;

  /**
   * 修改后的盘点数量
   */
  takeNum: number;

  /**
   * 出项数量
   */
  totalOutNum: number;

  /**
   * 进项数量
   */
  totalInNum: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 差异数量
   */
  diffNum: number;

  /**
   * 盘点任务ID
   */
  planId: string;
}
