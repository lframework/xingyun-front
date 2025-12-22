import { SortPageVo } from '@/api/model/sortPageVo';

export interface QuerySysParameterVo extends SortPageVo {
  /**
   * 租户ID
   */
  tenantId: number;

  /**
   * 键
   */
  pmKey: string;

  /**
   * 创建时间 起始时间
   */
  createTimeStart: string;

  /**
   * 创建时间 截止时间
   */
  createTimeEnd: string;
}
