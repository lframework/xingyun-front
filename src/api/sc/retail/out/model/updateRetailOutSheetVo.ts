import { CreateRetailOutSheetVo } from '@/api/sc/retail/out/model/createRetailOutSheetVo';

export interface UpdateRetailOutSheetVo extends CreateRetailOutSheetVo {
  /**
   * 出库单ID
   */
  id: string;
}
