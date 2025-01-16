export interface QuerySysSiteMessageBo {
  /**
   * ID
   */
  id: string;

  /**
   * 标题
   */
  title: string;

  /**
   * 接收人姓名
   */
  receiverName: string;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 是否已读
   */
  readed: boolean;

  /**
   * 已读时间
   */
  readTime: string;
}
