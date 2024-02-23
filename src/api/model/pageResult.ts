export interface PageResult<T> {
  /**
   * 是否有上一页
   */
  hasPrev: boolean;

  /**
   * 是否有下一页
   */
  hasNext: boolean;

  /**
   * 总记录数
   */
  totalCount: number;

  /**
   * 每页数据量
   */
  pageSize: number;

  /**
   * 当前页码
   */
  pageIndex: number;

  /**
   * 总页数
   */
  totalPage: number;

  /**
   * 数据
   */
  datas: T[] | null;

  /**
   * 附加数据
   */
  extra: Map<any, any>;
}
