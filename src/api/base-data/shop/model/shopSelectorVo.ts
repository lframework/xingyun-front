import { PageVo } from '@/api/model/pageVo';
import { SortPageVo } from '@/api/model/sortPageVo';

export interface ShopSelectorVo extends SortPageVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 状态
   */
  available: boolean;
}
