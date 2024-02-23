import { ProductBundleVo } from '@/api/base-data/product/info/model/productBundleVo';
import { ProductPropertyRelationVo } from '@/api/base-data/product/info/model/productPropertyRelationVo';

export interface CreateProductVo {
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
   * 外部编号
   */
  externalCode: string;

  /**
   * 类目ID
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
   * 重量（kg）
   */
  weight: number;

  /**
   * 体积（cm3）
   */
  volume: number;

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
}
