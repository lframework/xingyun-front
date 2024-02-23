import { PageVo } from '@/api/model/pageVo';

export interface SortPageVo extends PageVo {
  /**
   * 排序字段
   */
  sortField: string;
  /**
   * 排序类型
   */
  sortOrder: string;
}
