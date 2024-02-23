import { SortPageVo } from '@/api/model/sortPageVo';

export interface QuerySysOpenDomainVo extends SortPageVo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 状态
   */
  available: boolean;
}
