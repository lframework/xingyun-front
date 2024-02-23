export interface QueryOpLogBo {
  /**
   * ID
   */
  id: string;

  /**
   * 日志名称
   */
  name: string;

  /**
   * 类别
   */
  logType: number;

  /**
   * IP地址
   */
  ip: string;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建时间
   */
  createTime: string;
}
