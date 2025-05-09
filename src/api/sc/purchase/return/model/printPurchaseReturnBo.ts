export interface PrintPurchaseReturnBo {
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
   * 采购收货单号
   */
  receiveSheetCode: string;
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
  details: ReturnDetailBo[];
}

export interface ReturnDetailBo {
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
   * SKU编号
   */
  skuCode: string;
  /**
   * 简码
   */
  externalCode: string;
  /**
   * 退货数量
   */
  returnNum: number;
  /**
   * 采购价
   */
  purchasePrice: number;
  /**
   * 退货金额
   */
  returnAmount: number;
}
