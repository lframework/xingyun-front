import { ProductBundleBo } from '@/api/base-data/product/info/model/productBundleBo';
import { ProductSkuBo } from '@/api/base-data/product/info/model/productSkuBo';

export interface GetProductBo {
  /**
   * ID
   */
  id: string;

  /**
   * 编号
   */
  code?: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 简称
   */
  shortName: string;

  /**
   * 分类ID
   */
  categoryId: string;

  /**
   * 分类名称
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
   * SKU类型
   */
  skuType: number;

  /**
   * 商品主图
   */
  mainImage?: string[];

  /**
   * 详情图片
   */
  detailImages: string[];

  /**
   * SKU列表
   */
  skus: ProductSkuBo[];

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
