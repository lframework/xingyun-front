import { OrderPayTypeBo } from '@/api/sc/pay-type/model/orderPayTypeBo';

export interface GetPurchaseOrderBo {
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
   * 供应商ID
   */
  supplierId: string;

  /**
   * 供应商名称
   */
  supplierName: string;

  /**
   * 采购员ID
   */
  purchaserId: string;

  /**
   * 采购员姓名
   */
  purchaserName: string;

  /**
   * 预计到货日期
   */
  expectArriveDate: string;

  /**
   * 采购数量
   */
  totalNum: number;

  /**
   * 赠品数量
   */
  giftNum: number;

  /**
   * 采购金额
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
   * 采购数量
   */
  purchaseNum: number;

  /**
   * 采购价
   */
  purchasePrice: number;

  /**
   * 含税成本价
   */
  taxCostPrice: number;

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
