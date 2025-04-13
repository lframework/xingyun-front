export interface SuccessExportTaskBo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 文件大小
   */
  fileSize: string;

  /**
   * 上传记录ID
   */
  recordId: string;

  /**
   * 总数据条数
   */
  totalCount: number;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 完成时间
   */
  finishTime: string;
}
