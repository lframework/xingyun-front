import { SortPageVo } from '@/api/model/sortPageVo';

export interface QueryProductStockLogVo extends SortPageVo {
  /**
   * 仓库ID
   */
  scId: string;

  /**
   * 商品编号
   */
  productCode: string;

  /**
   * 商品名称
   */
  productName: string;

  /**
   * 商品类目ID
   */
  categoryId: string;

  /**
   * 商品品牌ID
   */
  brandId: string;

  /**
   * 创建起始时间
   */
  createStartTime: string;

  /**
   * 创建截止时间
   */
  createEndTime: string;

  /**
   * 业务类型
   */
  bizType: number;
}
