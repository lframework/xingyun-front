export interface GetSysNoticeBo {
  /**
   * ID
   */
  id: string;

  /**
   * 标题
   */
  title: string;

  /**
   * 内容
   */
  content: string;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 是否发布
   */
  published: boolean;
}
