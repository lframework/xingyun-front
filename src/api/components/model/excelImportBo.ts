export interface ExcelImportBo {
  /**
   * ID
   */
  id: string;

  /**
   * 当前进度（条数）
   */
  process: number;

  /**
   * 成功进度（条数）
   */
  successProcess: number;

  /**
   * 提示信息
   */
  tipMsgs: string[];

  /**
   * 是否存在错误
   */
  hasError: boolean;

  /**
   * 业务完成
   */
  finished: boolean;

  /**
   * 数据
   */
  data: any;
}
