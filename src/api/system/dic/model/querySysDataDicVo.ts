import { SortPageVo } from '@/api/model/sortPageVo';

export interface QuerySysDataDicVo extends SortPageVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 分类ID
   */
  categoryId: string;
}
