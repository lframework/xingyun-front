import { PageVo } from '@/api/model/pageVo';

export interface QuerySysMailMessageVo extends PageVo {
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
   * 邮箱地址
   */
  mail: string;

  /**
   * 发送状态
   */
  sendStatus: number;
}
