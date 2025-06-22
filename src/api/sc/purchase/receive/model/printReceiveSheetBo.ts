export interface PrintReceiveSheetBo {
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
   * 供应商编号
   */
  supplierCode: string;
  /**
   * 供应商名称
   */
  supplierName: string;
  /**
   * 采购员姓名
   */
  purchaserName: string;
  /**
   * 付款日期
   */
  paymentDate: string;
  /**
   * 到货日期
   */
  receiveDate: string;
  /**
   * 采购订单号
   */
  purchaseOrderCode: string;
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
