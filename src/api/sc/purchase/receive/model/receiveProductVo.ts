export interface ReceiveProductVo {
  /**
   * 商品ID
   */
  productId: string;

  /**
   * 采购价
   */
  purchasePrice: number;

  /**
   * 收货数量
   */
  receiveNum: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 采购订单明细ID
   */
  purchaseOrderDetailId: string;
}
