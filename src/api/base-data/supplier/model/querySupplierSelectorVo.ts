import { PageVo } from '@/api/model/pageVo';

export interface QuerySupplierSelectorVo extends PageVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 经营方式
   */
  manageType: number;

  /**
   * 状态
   */
  available: boolean;
}
