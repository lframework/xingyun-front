import { ProductBundleVo } from '@/api/base-data/product/info/model/productBundleVo';
import { ProductPropertyRelationVo } from '@/api/base-data/product/info/model/productPropertyRelationVo';

export interface UpdateProductVo {
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
   * 简称
   */
  shortName: string;

  /**
   * 商品SKU编号
   */
  skuCode: string;

  /**
   * 简码
   */
  externalCode: string;

  /**
   * 分类ID
   */
  categoryId: string;

  /**
   * 品牌ID
   */
  brandId: string;

  /**
   * 规格
   */
  spec: string;

  /**
   * 单位
   */
  unit: string;

  /**
   * 重量（kg）
   */
  weight: number;

  /**
   * 体积（cm3）
   */
  volume: number;

  /**
   * 进项税率（%）
   */
  taxRate: number;

  /**
   * 销项税率（%）
   */
  saleTaxRate: number;

  /**
   * 商品类型
   */
  productType: number;

  /**
   * 单品
   */
  productBundles: ProductBundleVo[];

  /**
   * 商品属性
   */
  properties: ProductPropertyRelationVo[];

  /**
   * 采购价
   */
  purchasePrice: number;

  /**
   * 销售价
   */
  salePrice: number;

  /**
   * 零售价
   */
  retailPrice: number;

  /**
   * 状态
   */
  available: boolean;
}
