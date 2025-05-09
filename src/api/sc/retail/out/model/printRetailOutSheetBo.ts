export interface PrintRetailOutSheetBo {
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
   * 会员编号
   */
  memberCode: string;
  /**
   * 会员名称
   */
  memberName: string;
  /**
   * 销售员姓名
   */
  salerName: string;
  /**
   * 付款日期
   */
  paymentDate: string;
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
   * 订单明细
   */
  details: OrderDetailBo[];
}

export interface OrderDetailBo {
  /**
   * 商品编号
   */
  productCode: string;
  /**
   * 商品名称
   */
  productName: string;
  /**
   * SKU编号
   */
  skuCode: string;
  /**
   * 简码
   */
  externalCode: string;
  /**
   * 收货数量
   */
  receiveNum: number;
  /**
   * 采购价
   */
  purchasePrice: number;
  /**
   * 收货金额
   */
  receiveAmount: number;
}

