import { CreateSysNotifyGroupVo } from '@/api/system/notify-group/model/createSysNotifyGroupVo';

export interface UpdateSysNotifyGroupVo extends CreateSysNotifyGroupVo {
  /**
   * ID
   */
  id: string;

  /**
   * 状态
   */
  available: boolean;
}
