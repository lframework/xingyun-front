export interface OrderTimeLineBo {
  /**
   * ID
   */
  id: string;

  /**
   * 订单ID
   */
  orderId: string;

  /**
   * 描述内容
   */
  content: string;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 业务类型
   */
  bizType: number;
}
