export interface StockCostAdjustSheetFullBo {
  /**
   * ID
   */
  id: string;

  /**
   * 业务单据号
   */
  code: string;

  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 仓库名称
   */
  scName: string;

  /**
   * 调价品种数
   */
  productNum: number;

  /**
   * 库存调价差额
   */
  diffAmount: number;

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

  /**
   * 拒绝原因
   */
  refuseReason: string;

  /**
   * 明细
   */
  details: DetailBo[];
}

export interface DetailBo {
  /**
   * ID
   */
  id: string;

  /**
   * 商品ID
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
   * 档案采购价
   */
  purchasePrice: number;

  /**
   * 库存数量
   */
  stockNum: number;

  /**
   * 调整前成本价
   */
  oriPrice: number;

  /**
   * 调整后成本价
   */
  price: number;

  /**
   * 库存调价差额
   */
  diffAmount: number;

  /**
   * 备注
   */
  description: string;

  /**
   *
   */
  scId: string;

  /**
   *
   */
  status: number;
}
