import { CreateReceiveSheetVo } from '@/api/sc/purchase/receive/model/createReceiveSheetVo';

export interface UpdateReceiveSheetVo extends CreateReceiveSheetVo {
  /**
   * 收货单ID
   */
  id: string;
}
