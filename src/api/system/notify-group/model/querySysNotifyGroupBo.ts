export interface QuerySysNotifyGroupBo {
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
  receiverType: string;

  /**
   * 消息类型
   */
  messageType: Array<number>;

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
   * 状态
   */
  available: boolean;
}
