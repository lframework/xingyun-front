import { PageVo } from '@/api/model/pageVo';

export interface SysUserGroupSelectorVo extends PageVo {
  /**
   * 名称
   */
  name: string;

  /**
   * 状态
   */
  available: boolean;
}
