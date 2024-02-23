export interface QuerySysNoticeBo {
  /**
   * ID
   */
  id: string;

  /**
   * 标题
   */
  title: string;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 是否发布
   */
  published: boolean;

  /**
   * 发布时间
   */
  publishTime: string;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 已读人数
   */
  readedNum: number;

  /**
   * 未读人数
   */
  unReadNum: number;
}
