import { CreateSettleFeeSheetVo } from '@/api/settle/fee/model/createSettleFeeSheetVo';

export interface UpdateSettleFeeSheetVo extends CreateSettleFeeSheetVo {
  /**
   * ID
   */
  id: string;
}
