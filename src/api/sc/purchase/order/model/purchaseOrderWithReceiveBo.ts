export interface PurchaseOrderWithReceiveBo {
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
   * 采购数量
   */
  orderNum: number;

  /**
   * 采购价
   */
  purchasePrice: number;

  /**
   * 剩余收货数量
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
   * 含税成本价
   */
  taxCostPrice: number;

  /**
   * 库存数量
   */
  stockNum: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 仓库ID
   */
  scId: string;
}
