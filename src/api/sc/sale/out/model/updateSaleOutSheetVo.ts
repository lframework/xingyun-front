import { CreateSaleOutSheetVo } from '@/api/sc/sale/out/model/createSaleOutSheetVo';

export interface UpdateSaleOutSheetVo extends CreateSaleOutSheetVo {
  /**
   * 出库单ID
   */
  id: string;
}
