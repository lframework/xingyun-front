export interface QueryQrtzBo {
  /**
   * 名称
   */
  name: string;

  /**
   * 分组
   */
  group: string;

  /**
   * 备注
   */
  description: string;

  /**
   * 任务类型
   */
  jobType: number;

  /**
   * Cron表达式
   */
  cron: string;

  /**
   * 状态
   */
  state: string;
}
