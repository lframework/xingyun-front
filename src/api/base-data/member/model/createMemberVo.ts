export interface CreateMemberVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 性别
   */
  gender: number;

  /**
   * 联系电话
   */
  telephone: string;

  /**
   * 电子邮箱
   */
  email: string;

  /**
   * 出生日期
   */
  birthday: string;

  /**
   * 入会日期
   */
  joinDay: string;

  /**
   * 所属门店ID
   */
  shopId: string;

  /**
   * 所属导购ID
   */
  guiderId: string;

  /**
   * 备注
   */
  description: string;
}
