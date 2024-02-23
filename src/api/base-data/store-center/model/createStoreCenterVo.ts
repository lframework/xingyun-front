export interface CreateStoreCenterVo {
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
  cityId: string;

  /**
   * 地址
   */
  address: string;

  /**
   * 仓库人数
   */
  peopleNum: number;

  /**
   * 备注
   */
  description: string;
}
