import { CreateStockCostAdjustSheetVo } from '@/api/sc/stock/adjust/cost/model/createStockCostAdjustSheetVo';

export interface UpdateStockCostAdjustSheetVo extends CreateStockCostAdjustSheetVo {
  /**
   * ID
   */
  id: string;
}
