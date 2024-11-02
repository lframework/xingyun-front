import { SortPageVo } from '@/api/model/sortPageVo';

export interface QuerySysGenerateCodeVo extends SortPageVo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;
}
