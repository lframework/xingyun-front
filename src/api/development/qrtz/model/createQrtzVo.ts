export interface CreateQrtzVo {
  /**
   * 名称
   */
  name: string;

  /**
   * 分组
   */
  group: string;

  /**
   * 租户ID
   */
  tenantId: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 执行类名
   */
  targetClassName: string;

  /**
   * 执行方法名
   */
  targetMethodName: string;

  /**
   * 执行参数类型
   */
  targetParamTypes: string[];

  /**
   * 执行参数
   */
  targetParams: string[];

  /**
   * Cron表达式
   */
  cron: string;

  /**
   *
   */
  jobType: number;

  /**
   * 脚本
   */
  script: string;
}
