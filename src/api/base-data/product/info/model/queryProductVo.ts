import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryProductVo extends SortPageVo {
  /**
   * 编号
   */
  code: string;

  /**
   * 名称
   */
  name: string;

  /**
   * SKU
   */
  skuCode: string;

  /**
   * 简称
   */
  shortName: string;

  /**
   * 品牌ID
   */
  brandId: string;

  /**
   * 类目ID
   */
  categoryId: string;

  /**
   * 商品类型
   */
  productType: number;

  /**
   * 创建起始时间
   */
  startTime: string;

  /**
   * 创建截止时间
   */
  endTime: string;

  /**
   * 状态
   */
  available: boolean;
}
