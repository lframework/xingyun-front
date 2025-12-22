import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryPayTypeVo extends SortPageVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;
}
