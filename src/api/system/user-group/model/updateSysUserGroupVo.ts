import { CreateSysUserGroupVo } from '@/api/system/user-group/model/createSysUserGroupVo';

export interface UpdateSysUserGroupVo extends CreateSysUserGroupVo {
  /**
   * ID
   */
  id: string;

  /**
   * 状态
   */
  available: boolean;
}
