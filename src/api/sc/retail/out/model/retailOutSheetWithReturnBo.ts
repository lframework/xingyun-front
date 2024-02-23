export interface RetailOutSheetWithReturnBo {
  /**
   * 订单ID
   */
  id: string;

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
   * 订单明细
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
   * 剩余退货数量
   */
  remainNum: number;

  /**
   * 是否赠品
   */
  isGift: boolean;

  /**
   * 税率（%）
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
