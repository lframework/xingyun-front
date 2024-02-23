import { PageVo } from '@/api/model/pageVo';

export interface QueryFileBoxVo extends PageVo {
  /**
   * 名称
   */
  name: string;

  /**
   * 路径
   */
  path: string;
}
