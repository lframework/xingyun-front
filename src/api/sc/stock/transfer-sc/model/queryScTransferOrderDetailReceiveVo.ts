import { PageVo } from '@/api/model/pageVo';

export interface QueryScTransferOrderDetailReceiveVo extends PageVo {
  /**
   * 调拨单ID
   */
  orderId: string;

  /**
   * 明细ID
   */
  detailId: string;
}
