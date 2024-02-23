import { CreateLogisticsSheetVo } from '@/api/sc/logistics/sheet/model/createLogisticsSheetVo';

export interface UpdateLogisticsSheetVo extends CreateLogisticsSheetVo {
  /**
   * ID
   */
  id: string;
}
