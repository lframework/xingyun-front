export interface GetPurchaseConfigBo {
  /**
   * 采购收货单是否关联采购订单
   */
  receiveRequirePurchase: boolean;

  /**
   * 采购收货单是否多次关联采购订单
   */
  receiveMultipleRelatePurchase: boolean;

  /**
   * 采购退货单是否关联采购收货单
   */
  purchaseReturnRequireReceive: boolean;

  /**
   * 采购退货单是否多次关联采购收货单
   */
  purchaseReturnMultipleRelateReceive: boolean;
}
