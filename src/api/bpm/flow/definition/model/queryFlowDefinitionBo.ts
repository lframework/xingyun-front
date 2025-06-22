export interface QueryFlowDefinitionBo {
  /**
   * ID
   */
  id: string;
  /**
   * 流程编号
   */
  flowCode: string;
  /**
   * 流程名称
   */
  flowName: string;
  /**
   * 流程分类
   */
  category: string;
  /**
   * 版本号
   */
  version: string;
  /**
   * 是否发布
   */
  isPublish: number;
  /**
   * 激活状态
   */
  activityStatus: number;
}
