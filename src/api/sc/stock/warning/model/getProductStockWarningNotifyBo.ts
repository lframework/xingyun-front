export interface GetProductStockWarningNotifyBo {
  /**
   * 消息通知组ID
   */
  id: string;

  /**
   * 消息通知组名称
   */
  name: string;

  /**
   * 消息通知组状态
   */
  available: boolean;
}
