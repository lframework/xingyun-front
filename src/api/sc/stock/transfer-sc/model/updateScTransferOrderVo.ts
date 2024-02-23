import { CreateScTransferOrderVo } from '@/api/sc/stock/transfer-sc/model/createScTransferOrderVo';

export interface UpdateScTransferOrderVo extends CreateScTransferOrderVo {
  /**
   * ID
   */
  id: string;
}
