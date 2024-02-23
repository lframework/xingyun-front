import { SortPageVo } from '@/api/model/sortPageVo';

export interface QuerySettleFeeSheetVo extends SortPageVo {
  /**
   * 审核人
   */
  approveBy: string;

  /**
   * 审核截止时间
   */
  approveEndTime: string;

  /**
   * 审核起始时间
   */
  approveStartTime: string;

  /**
   * 业务单据号
   */
  code: string;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建截止时间
   */
  createEndTime: string;

  /**
   * 创建起始时间
   */
  createStartTime: string;

  /**
   * 结算状态
   */
  settleStatus: number;

  /**
   * 审核状态
   */
  status: number;

  /**
   * 供应商ID
   */
  supplierId: string;
}
