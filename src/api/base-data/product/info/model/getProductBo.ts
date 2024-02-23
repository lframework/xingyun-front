import { ProductBundleBo } from '@/api/base-data/product/info/model/productBundleBo';

export interface GetProductBo {
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
   * SKU
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
   * 类目名称
   */
  categoryName: string;

  /**
   * 品牌ID
   */
  brandId: string;

  /**
   * 品牌名称
   */
  brandName: string;

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
   * 规格
   */
  spec: string;

  /**
   * 单位
   */
  unit: string;

  /**
   * 商品类型
   */
  productType: number;

  /**
   * 单品
   */
  productBundles: ProductBundleBo[];

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

  /**
   * 属性
   */
  properties: PropertyBo[];
}

export interface PropertyBo {
  /**
   * 属性ID
   */
  id: string;

  /**
   * 属性名
   */
  name: string;

  /**
   * 字段类型
   */
  columnType: number;

  /**
   * 属性值
   */
  text: string;

  /**
   * 属性文本
   */
  textStr: string;
}
