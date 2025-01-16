import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryProductStockWarningVo extends SortPageVo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 商品ID
   */
  productId: string;

  /**
   * 采购供应商ID
   */
  supplierId: string;

  /**
   * 操作时间 起始时间
   */
  updateTimeStart: string;

  /**
   * 操作时间 截止时间
   */
  updateTimeEnd: string;

  /**
   * 状态
   */
  available: boolean;
}
