import { StockCostAdjustProductVo } from '@/api/sc/stock/adjust/cost/model/stockCostAdjustProductVo';

export interface CreateStockCostAdjustSheetVo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 备注
   */
  description: string;

  /**
   * 商品信息
   */
  products: StockCostAdjustProductVo[];
}
