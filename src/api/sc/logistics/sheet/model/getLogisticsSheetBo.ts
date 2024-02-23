export interface GetLogisticsSheetBo {
  /**
   * ID
   */
  id: string;

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
   * 寄件人姓名
   */
  senderName: string;

  /**
   * 寄件人联系电话
   */
  senderTelephone: string;

  /**
   * 寄件人省
   */
  senderProvinceId: string;

  /**
   * 寄件人市
   */
  senderCityId: string;

  /**
   * 寄件人区
   */
  senderDistrictId: string;

  /**
   * 寄件人地区
   */
  senderCity: string;

  /**
   * 寄件人地址
   */
  senderAddress: string;

  /**
   * 收件人姓名
   */
  receiverName: string;

  /**
   * 收件人联系电话
   */
  receiverTelephone: string;

  /**
   * 收件人省
   */
  receiverProvinceId: string;

  /**
   * 收件人市
   */
  receiverCityId: string;

  /**
   * 收件人区
   */
  receiverDistrictId: string;

  /**
   * 收件人地区
   */
  receiverCity: string;

  /**
   * 收件人地址
   */
  receiverAddress: string;

  /**
   * 状态
   */
  status: number;

  /**
   * 备注
   */
  description: string;

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
   * 发货人
   */
  deliveryBy: string;

  /**
   * 发货时间
   */
  deliveryTime: string;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 修改人
   */
  updateBy: string;

  /**
   * 修改时间
   */
  updateTime: string;

  /**
   * 订单明细
   */
  details: OrderDetailBo[];
}

export interface OrderDetailBo {
  /**
   * ID
   */
  id: string;

  /**
   * 物流单ID
   */
  sheetId: string;

  /**
   * 业务单据ID
   */
  bizId: string;

  /**
   * 业务单据号
   */
  bizCode: string;

  /**
   * 业务类型
   */
  bizType: number;

  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 仓库名称
   */
  scName: string;

  /**
   * 收货人ID
   */
  receiverId: string;

  /**
   * 收货人姓名
   */
  receiverName: string;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建时间
   */
  createTime: string;
}
