export interface UpdateLogisticsCompanyVo {
  /**
   * ID
   */
  id: string;

  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 联系人
   */
  contact: string;

  /**
   * 联系电话
   */
  telephone: string;

  /**
   * 地区ID
   */
  cityId: string;

  /**
   * 地址
   */
  address: string;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 备注
   */
  description: string;
}
