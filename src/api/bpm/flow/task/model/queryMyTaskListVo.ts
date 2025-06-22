import { PageVo } from '@/api/model/pageVo';

export interface QueryMyTaskListVo extends PageVo {
  /**
   * 流程编号
   */
  flowCode: string;
  /**
   * 流程名称
   */
  flowName: string;

  /**
   * 任务标题
   */
  title: string;
}
