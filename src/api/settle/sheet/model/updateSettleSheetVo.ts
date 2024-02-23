import { CreateSettleSheetVo } from '@/api/settle/sheet/model/createSettleSheetVo';

export interface UpdateSettleSheetVo extends CreateSettleSheetVo {
  /**
   * ID
   */
  id: string;
}
