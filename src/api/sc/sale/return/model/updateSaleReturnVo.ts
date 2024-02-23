import { CreateSaleReturnVo } from '@/api/sc/sale/return/model/createSaleReturnVo';

export interface UpdateSaleReturnVo extends CreateSaleReturnVo {
  /**
   * 退单ID
   */
  id: string;
}
