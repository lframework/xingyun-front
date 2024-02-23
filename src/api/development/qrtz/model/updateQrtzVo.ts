import { CreateQrtzVo } from '@/api/development/qrtz/model/createQrtzVo';

export interface UpdateQrtzVo extends CreateQrtzVo {
  /**
   * 原始任务名称
   */
  oriName: string;

  /**
   * 原始任务分组
   */
  oriGroup: string;
}
