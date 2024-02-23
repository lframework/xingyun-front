import { PageVo } from '@/api/model/pageVo';

export interface QueryQrtzVo extends PageVo {
  /**
   * 名称
   */
  name: string;

  /**
   * 组
   */
  group: string;

  /**
   * 状态
   */
  state: string;
}
