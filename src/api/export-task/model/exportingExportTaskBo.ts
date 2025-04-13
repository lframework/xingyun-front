export interface ExportingExportTaskBo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 总数据条数
   */
  totalCount: number;

  /**
   * 当前完成数据条数
   */
  curCount: number;

  /**
   * 状态
   */
  status: number;

  /**
   * 创建时间
   */
  createTime: string;
}
