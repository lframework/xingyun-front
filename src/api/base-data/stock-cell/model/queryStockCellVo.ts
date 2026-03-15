import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryStockCellVo extends SortPageVo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 仓位类别
   */
  cellType: number;
}
