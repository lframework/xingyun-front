import { CreateRetailReturnVo } from '@/api/sc/retail/return/model/createRetailReturnVo';

export interface UpdateRetailReturnVo extends CreateRetailReturnVo {
  /**
   * 退单ID
   */
  id: string;
}
