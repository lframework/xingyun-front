import { LogisticsSheetBizOrderVo } from '@/api/sc/logistics/sheet/model/logisticsSheetBizOrderVo';

export interface CreateLogisticsSheetVo {
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
   * 收件人地址
   */
  receiverAddress: string;

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
   * 备注
   */
  description: string;

  /**
   *
   */
  bizOrders: LogisticsSheetBizOrderVo[];
}
