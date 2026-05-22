import { PageVo } from '@/api/model/pageVo';

export interface QueryProductSalePropertyItemVo extends PageVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 属性ID
   */
  propertyId: string;
}
