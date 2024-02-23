export interface QueryLogisticsSheetBo {
  /**
   * ID
   */
  id: string;

  /**
   * 业务单据号
   */
  code: string;

  /**
   * 物流单号
   */
  logisticsNo: string;

  /**
   * 物流公司名称
   */
  logisticsCompanyName: string;

  /**
   * 总重量
   */
  totalWeight: number;

  /**
   * 总体积
   */
  totalVolume: number;

  /**
   * 物流费
   */
  totalAmount: number;

  /**
   * 状态
   */
  status: number;

  /**
   * 备注
   */
  description: string;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 发货人
   */
  deliveryBy: string;

  /**
   * 发货时间
   */
  deliveryTime: string;
}
