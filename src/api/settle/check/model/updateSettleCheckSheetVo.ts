import { CreateSettleCheckSheetVo } from '@/api/settle/check/model/createSettleCheckSheetVo';

export interface UpdateSettleCheckSheetVo extends CreateSettleCheckSheetVo {
  /**
   * ID
   */
  id: string;
}
