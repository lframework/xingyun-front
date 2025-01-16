export interface QuerySysMailMessageBo {
  /**
   * ID
   */
  id: string;

  /**
   * 标题
   */
  title: string;

  /**
   * 接收邮箱
   */
  mail: string;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 发送状态
   */
  sendStatus: number;
}
