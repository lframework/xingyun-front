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
  /**
   * 采购订单是否开启审批流程
   */
  purchaseRequireBpm: boolean;
  /**
   * 采购订单关联的审批流程ID
   */
  purchaseBpmProcessId: string;
  /**
   * 采购订单关联的审批流程编号
   */
  purchaseBpmProcessCode: string;
}
