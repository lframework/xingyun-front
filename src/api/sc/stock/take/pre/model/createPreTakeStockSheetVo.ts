import { PreTakeStockProductVo } from '@/api/sc/stock/take/pre/model/preTakeStockProductVo';

export interface CreatePreTakeStockSheetVo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 预先盘点状态
   */
  takeStatus: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 商品
   */
  products: PreTakeStockProductVo[];
}
