import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryLogisticsSheetVo extends SortPageVo {
  /**
   * 单号
   */
  code: string;

  /**
   * 物流单号
   */
  logisticsNo: string;

  /**
   * 物流公司ID
   */
  logisticsCompanyId: string;

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
   * 发货人ID
   */
  deliveryBy: string;

  /**
   * 发货起始时间
   */
  deliveryStartTime: string;

  /**
   * 发货截止时间
   */
  deliveryEndTime: string;

  /**
   * 状态
   */
  status: number;
}
