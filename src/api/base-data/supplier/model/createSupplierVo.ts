export interface CreateSupplierVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 助记码
   */
  mnemonicCode: string;

  /**
   * 联系人
   */
  contact: string;

  /**
   * 联系电话
   */
  telephone: string;

  /**
   * 电子邮箱
   */
  email: string;

  /**
   * 邮编
   */
  zipCode: string;

  /**
   * 传真
   */
  fax: string;

  /**
   * 地区ID
   */
  cityId: string;

  /**
   * 地址
   */
  address: string;

  /**
   * 送货周期（天）
   */
  deliveryCycle: number;

  /**
   * 经营方式
   */
  manageType: number;

  /**
   * 结算方式
   */
  settleType: number;

  /**
   * 统一社会信用代码
   */
  creditCode: string;

  /**
   * 纳税人识别号
   */
  taxIdentifyNo: string;

  /**
   * 开户银行
   */
  bankName: string;

  /**
   * 户名
   */
  accountName: string;

  /**
   * 银行账号
   */
  accountNo: string;

  /**
   * 备注
   */
  description: string;
}
