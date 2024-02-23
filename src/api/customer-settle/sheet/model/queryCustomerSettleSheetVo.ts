import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryCustomerSettleSheetVo extends SortPageVo {
  /**
   * 业务单据号
   */
  code: string;

  /**
   * 客户ID
   */
  customerId: string;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建起始时间
   */
  createStartTime: string;

  /**
   * 创建截止时间
   */
  createEndTime: string;

  /**
   * 审核人
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
   * 审核状态
   */
  status: number;
}
