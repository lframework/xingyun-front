import { PageVo } from '@/api/model/pageVo';

export interface QuerySaleOutSheetWithReturnVo extends PageVo {
  /**
   * 单号
   */
  code: string;

  /**
   * 客户ID
   */
  customerId: string;

  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 操作人ID
   */
  createBy: string;

  /**
   * 操作起始时间
   */
  createStartTime: string;

  /**
   * 操作截止时间
   */
  createEndTime: string;
}
