export interface LogisticsSheetCalcWeightOrVolumeVo {
  /**
   * 业务单据
   */
  bizOrders: BizOrderVo[];
}
export interface BizOrderVo {
  /**
   * 业务单据ID
   */
  bizId: string;

  /**
   * 业务类型
   */
  bizType: number;
}
