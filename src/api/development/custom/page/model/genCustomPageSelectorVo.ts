import { PageVo } from '@/api/model/pageVo';

export interface GenCustomPageSelectorVo extends PageVo {
  /**
   * ID
   */
  id: number;

  /**
   * 名称
   */
  name: string;

  /**
   * 分类ID
   */
  categoryId: string;
}
