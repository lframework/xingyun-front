import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryTenantVo extends SortPageVo {
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
