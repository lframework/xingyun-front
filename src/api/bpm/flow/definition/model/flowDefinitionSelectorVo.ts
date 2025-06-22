import { PageVo } from '@/api/model/pageVo';

export interface FlowDefinitionSelectorVo extends PageVo {
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
}
