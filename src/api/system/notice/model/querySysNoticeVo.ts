import { PageVo } from '@/api/model/pageVo';

export interface QuerySysNoticeVo extends PageVo {
  /**
   * 标题
   */
  title: string;

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
