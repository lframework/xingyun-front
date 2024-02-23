import { CreateSysMenuVo } from '@/api/system/menu/model/createSysMenuVo';

export interface UpdateSysMenuVo extends CreateSysMenuVo {
  /**
   * ID
   */
  id: string;

  /**
   * 状态
   */
  available: boolean;
}
