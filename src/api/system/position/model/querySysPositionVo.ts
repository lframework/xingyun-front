import { SortPageVo } from '@/api/model/sortPageVo';

export interface QuerySysPositionVo extends SortPageVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 状态
   */
  available: boolean;
}
