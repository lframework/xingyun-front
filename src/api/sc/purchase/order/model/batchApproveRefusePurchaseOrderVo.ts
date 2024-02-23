export interface BatchApproveRefusePurchaseOrderVo {
  /**
   * 订单ID
   */
  ids: string[];

  /**
   * 拒绝理由
   */
  refuseReason: string;
}
