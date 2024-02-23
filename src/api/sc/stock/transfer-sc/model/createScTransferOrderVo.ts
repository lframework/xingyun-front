import { ScTransferProductVo } from '@/api/sc/stock/transfer-sc/model/scTransferProductVo';

export interface CreateScTransferOrderVo {
  /**
   * 转出仓库ID
   */
  sourceScId: string;

  /**
   * 转入仓库ID
   */
  targetScId: string;

  /**
   * 备注
   */
  description: string;

  /**
   * 商品信息
   */
  products: ScTransferProductVo[];
}
