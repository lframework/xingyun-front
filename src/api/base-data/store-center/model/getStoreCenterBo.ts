export interface GetStoreCenterBo {
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
   * 联系人手机号码
   */
  telephone: string;

  /**
   * 地区ID
   */
  city: string[];

  /**
   * 地区名称
   */
  cityName: string;

  /**
   * 地址
   */
  address: string;

  /**
   * 仓库人数
   */
  peopleNum: number;

  /**
   * 状态
   */
  available: boolean;

  /**
   * 备注
   */
  description: string;
}
