import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryAddressVo extends SortPageVo {
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
   * 详细地址
   */
  address: string;

  /**
   * 是否默认地址
   */
  isDefault: boolean;
}
