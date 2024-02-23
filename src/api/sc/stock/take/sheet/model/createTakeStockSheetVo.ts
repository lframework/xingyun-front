import { TakeStockSheetProductVo } from '@/api/sc/stock/take/sheet/model/takeStockSheetProductVo';

export interface CreateTakeStockSheetVo {
  /**
   * 盘点任务ID
   */
  planId: string;

  /**
   * 预先盘点单ID
   */
  preSheetId: string;

  /**
   * 备注
   */
  description: string;

  /**
   * 商品信息
   */
  products: TakeStockSheetProductVo[];
}
