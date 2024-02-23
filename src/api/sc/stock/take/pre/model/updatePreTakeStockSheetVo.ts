import { CreatePreTakeStockSheetVo } from '@/api/sc/stock/take/pre/model/createPreTakeStockSheetVo';

export interface UpdatePreTakeStockSheetVo extends CreatePreTakeStockSheetVo {
  /**
   * ID
   */
  id: string;
}
