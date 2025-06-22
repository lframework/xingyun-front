export interface UndoTaskVo {
  /**
   * 流程实例ID
   */
  instanceId: string;
  /**
   * 说明
   */
  message: string;

  /**
   * 表单变量
   */
  variables: any;
}
