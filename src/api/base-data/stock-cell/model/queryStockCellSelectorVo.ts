import { PageVo } from '@/api/model/pageVo';

export interface QueryStockCellSelectorVo extends PageVo {
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
