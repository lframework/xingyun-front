import { CreateStockAdjustSheetVo } from '@/api/sc/stock/adjust/stock/model/createStockAdjustSheetVo';

export interface UpdateStockAdjustSheetVo extends CreateStockAdjustSheetVo {
  /**
   * ID
   */
  id: string;
}
