import { CreateProductStockWarningVo } from '@/api/sc/stock/warning/model/createProductStockWarningVo';

export interface UpdateProductStockWarningVo extends CreateProductStockWarningVo {
  /**
   * ID
   */
  id: string;

  /**
   * 状态
   */
  available: boolean;
}
