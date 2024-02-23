export interface GetSaleReturnBo {
  /**
   * ID
   */
  id: string;

  /**
   * 单号
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
   * 客户ID
   */
  customerId: string;

  /**
   * 客户名称
   */
  customerName: string;

  /**
   * 销售员ID
   */
  salerId: string;

  /**
   * 销售员姓名
   */
  salerName: string;

  /**
   * 付款日期
   */
  paymentDate: string;

  /**
   * 销售出库单ID
   */
  outSheetId: string;

  /**
   * 销售出库单号
   */
  outSheetCode: string;

  /**
   * 退货数量
   */
  totalNum: number;

  /**
   * 赠品数量
   */
  giftNum: number;

  /**
   * 退货金额
   */
  totalAmount: number;

  /**
   * 支付方式
   */
  payTypes: OrderPayTypeBo[];

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
   * 状态
   */
  status: number;

  /**
   * 拒绝原因
   */
  refuseReason: string;

  /**
   * 结算状态
   */
  settleStatus: number;

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
   * 外部编号
   */
  externalCode: string;

  /**
   * 单位
   */
  unit: string;

  /**
   * 规格
   */
  spec: string;

  /**
   * 类目名称
   */
  categoryName: string;

  /**
   * 品牌名称
   */
  brandName: string;

  /**
   * 出库数量
   */
  outNum: number;

  /**
   * 剩余退货数量
   */
  remainNum: number;

  /**
   * 退货数量
   */
  returnNum: number;

  /**
   * 原价
   */
  salePrice: number;

  /**
   * 价格
   */
  taxPrice: number;

  /**
   * 折扣
   */
  discountRate: number;

  /**
   * 是否赠品
   */
  isGift: boolean;

  /**
   * 税率
   */
  taxRate: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 销售出库单明细ID
   */
  outSheetDetailId: string;

  /**
   * 仓库ID
   */
  scId: string;
}
