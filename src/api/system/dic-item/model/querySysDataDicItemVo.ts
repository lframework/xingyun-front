import { SortPageVo } from '@/api/model/sortPageVo';

export interface QuerySysDataDicItemVo extends SortPageVo {
  /**
   * 租户ID
   */
  tenantId: number;

  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 字典ID
   */
  dicId: string;
}
