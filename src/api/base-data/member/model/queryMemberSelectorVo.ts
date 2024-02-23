import { PageVo } from '@/api/model/pageVo';

export interface QueryMemberSelectorVo extends PageVo {
  /**
   * 状态
   */
  available: boolean;

  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;
}
