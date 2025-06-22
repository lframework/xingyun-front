import { PageVo } from '@/api/model/pageVo';

export interface QueryFlowDefinitionVo extends PageVo {
  /**
   * 流程编号
   */
  code: string;
  /**
   * 流程名称
   */
  name: string;
  /**
   * 流程分类ID
   */
  categoryId: string;
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
