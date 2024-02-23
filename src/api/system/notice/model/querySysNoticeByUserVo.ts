import { PageVo } from '@/api/model/pageVo';

export interface QuerySysNoticeByUserVo extends PageVo {
  /**
   * 标题
   */
  title?: string;

  /**
   * 创建时间 起始时间
   */
  createTimeStart?: string;

  /**
   * 创建时间 截止时间
   */
  createTimeEnd?: string;

  /**
   * 是否已读
   */
  readed?: boolean;
}
