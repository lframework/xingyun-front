export interface GetAddressBo {
  /**
   * ID
   */
  id: string;

  /**
   * 实体ID
   */
  entityId: string;

  /**
   * 实体名称
   */
  entityName: string;

  /**
   * 实体类型
   */
  entityType: number;

  /**
   * 地址类型
   */
  addressType: number;

  /**
   * 姓名
   */
  name: string;

  /**
   * 手机号
   */
  telephone: string;

  /**
   * 省ID
   */
  provinceId: string;

  /**
   * 省名称
   */
  provinceName: string;

  /**
   * 市ID
   */
  cityId: string;

  /**
   * 市名称
   */
  cityName: string;

  /**
   * 区ID
   */
  districtId: string;

  /**
   * 区名称
   */
  districtName: string;

  /**
   * 详细地址
   */
  address: string;

  /**
   * 是否默认地址
   */
  isDefault: boolean;
}
