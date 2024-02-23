import { PageVo } from '@/api/model/pageVo';

export interface SysOpenDomainSelectorVo extends PageVo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 状态
   */
  available: boolean;
}
