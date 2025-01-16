import { PageVo } from '@/api/model/pageVo';

export interface SysNotifyGroupSelectorVo extends PageVo {
  /**
   * 名称
   */
  name: string;

  /**
   * 状态
   */
  available: boolean;
}
