export interface QueryMyTaskListBo {
  /**
   * 任务标题
   */
  title: string;
  /**
   * 业务ID
   */
  businessId: string;
  /**
   * 节点编号
   */
  nodeCode: string;
  /**
   * 节点名称
   */
  nodeName: string;
  /**
   * 节点类型
   */
  nodeType: number;
  /**
   * 流程状态
   */
  flowStatus: string;
  /**
   * 流程定义ID
   */
  flowId: string;
  /**
   * 流程定义编号
   */
  flowCode: string;
  /**
   * 流程定义名称
   */
  flowName: string;
  /**
   * 流程定义分类ID
   */
  categoryId: string;
  /**
   * 流程定义分类名称
   */
  categoryName: string;
  /**
   * 流程实例ID
   */
  instanceId: string;
  /**
   * 流程实例扩展字段
   */
  ext: string;
  /**
   * 流程发起人ID
   */
  startById: string;
  /**
   * 流程发起人
   */
  startBy: string;
  /**
   * 流程发起时间
   */
  startTime: string;
  /**
   * 流程结束时间
   */
  endTime: string;
  /**
   * 流程执行时间
   */
  executeTime: string;
}
