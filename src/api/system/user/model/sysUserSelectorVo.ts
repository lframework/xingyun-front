import { PageVo } from '@/api/model/pageVo';

export interface SysUserSelectorVo extends PageVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 姓名
   */
  name: string;

  /**
   * 用户名
   */
  username: string;
}
