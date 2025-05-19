import { SortPageVo } from '@/api/model/sortPageVo';

export interface QuerySysUserGroupVo extends SortPageVo {
  /**
   * 名称
   */
  name: string;

  /**
   * 创建时间 起始时间
   */
  createTimeStart: string;

  /**
   * 创建时间 截止时间
   */
  createTimeEnd: string;

  /**
   * 状态
   */
  available: boolean;
}
