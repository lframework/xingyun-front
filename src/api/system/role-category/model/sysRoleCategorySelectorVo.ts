import { PageVo } from '@/api/model/pageVo';

export interface SysRoleCategorySelectorVo extends PageVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;
}
