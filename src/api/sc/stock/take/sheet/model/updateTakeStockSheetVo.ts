import { TakeStockSheetProductVo } from '@/api/sc/stock/take/sheet/model/takeStockSheetProductVo';

export interface UpdateTakeStockSheetVo {
  /**
   * ID
   */
  id: string;

  /**
   * 备注
   */
  description: string;

  /**
   * 商品信息
   */
  products: TakeStockSheetProductVo[];
}
