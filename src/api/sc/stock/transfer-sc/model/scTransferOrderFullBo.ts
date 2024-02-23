export interface ScTransferOrderFullBo {
  /**
   * ID
   */
  id: string;

  /**
   * 业务单据号
   */
  code: string;

  /**
   * 转出仓库ID
   */
  sourceScId: string;

  /**
   * 转出仓库名称
   */
  sourceScName: string;

  /**
   * 转入仓库ID
   */
  targetScId: string;

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
   * 调拨数量
   */
  transferNum: number;

  /**
   * 当前库存数量
   */
  curStockNum: number;

  /**
   * 已收货数量
   */
  receiveNum: number;

  /**
   * 备注
   */
  description: string;
}
