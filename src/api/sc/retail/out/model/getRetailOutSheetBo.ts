import { OrderPayTypeBo } from '@/api/sc/pay-type/model/orderPayTypeBo';

export interface GetRetailOutSheetBo {
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
   * 会员ID
   */
  memberId: string;

  /**
   * 会员名称
   */
  memberName: string;

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
   * 销售数量
   */
  totalNum: number;

  /**
   * 赠品数量
   */
  giftNum: number;

  /**
   * 销售金额
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
  details: OrderDetailBo[];
}

export interface OrderDetailBo {
  /**
   * 明细ID
   */
  id: string;

  /**
   * 组合商品ID
   */
  mainProductId: string;

  /**
   * 组合商品名称
   */
  mainProductName: string;

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
   * 单位
   */
  unit: string;

  /**
   * 规格
   */
  spec: string;

  /**
   * 分类名称
   */
  categoryName: string;

  /**
   * 品牌名称
   */
  brandName: string;

  /**
   * 销售数量
   */
  orderNum: number;

  /**
   * 剩余出库数量
   */
  remainNum: number;

  /**
   * 出库数量
   */
  outNum: number;

  /**
   * 原价
   */
  retailPrice: number;

  /**
   * 价格
   */
  taxPrice: number;

  /**
   * 折扣
   */
  discountRate: number;

  /**
   * 库存数量
   */
  stockNum: number;

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
   * 仓库ID
   */
  scId: string;
}
