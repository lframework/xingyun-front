export interface GetSysNotifyGroupBo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 接收者类型
   */
  receiverType: number;

  /**
   * 接收者ID
   */
  receiverIds: Array<string>;

  /**
   * 消息类型
   */
  messageType: Array<number>;

  /**
   * 备注
   */
  description: string;

  /**
   * 状态
   */
  available: boolean;
}
