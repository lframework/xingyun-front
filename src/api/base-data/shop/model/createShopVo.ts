export interface CreateShopVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 所属部门ID
   */
  deptId: string;

  /**
   * 经度
   */
  lng: number;

  /**
   * 纬度
   */
  lat: number;

  /**
   * 备注
   */
  description: string;
}
