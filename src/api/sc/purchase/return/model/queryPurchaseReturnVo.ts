import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryPurchaseReturnVo extends SortPageVo {
  /**
   * 单号
   */
  code: string;

  /**
   * 供应商ID
   */
  supplierId: string;

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

  /**
   * 审核人ID
   */
  approveBy: string;

  /**
   * 审核起始时间
   */
  approveStartTime: string;

  /**
   * 审核截止时间
   */
  approveEndTime: string;

  /**
   * 状态
   */
  status: number;

  /**
   * 采购员ID
   */
  purchaserId: string;

  /**
   * 采购订单号
   */
  receiveSheetCode: string;

  /**
   * 结算状态
   */
  settleStatus: number;
}
