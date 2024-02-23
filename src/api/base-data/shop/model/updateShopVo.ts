export interface UpdateShopVo {
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
   * 状态
   */
  available: boolean;

  /**
   * 备注
   */
  description: string;
}
