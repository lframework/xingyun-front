import { PageVo } from '@/api/model/pageVo';

export interface TenantSelectorVo extends PageVo {
  /**
   * 租户ID
   */
  tenantId: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 状态
   */
  available: boolean;
}
