import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { ProductCategorySalePropertyBo } from '@/api/base-data/product/category-sale-property/model/productCategorySalePropertyBo';
import { BindProductCategorySalePropertyVo } from '@/api/base-data/product/category-sale-property/model/bindProductCategorySalePropertyVo';
import { CreateProductCategorySalePropertyVo } from '@/api/base-data/product/category-sale-property/model/createProductCategorySalePropertyVo';

const baseUrl = '/basedata/product/category/sale/property';
const region = 'cloud-api';

/**
 * 商品分类销售属性配置列表
 */
export function query(categoryId: string): Promise<ProductCategorySalePropertyBo[]> {
  return defHttp.get<ProductCategorySalePropertyBo[]>(
    {
      url: baseUrl + '/query',
      params: {
        categoryId,
      },
    },
    {
      region,
    },
  );
}

/**
 * 绑定已有销售属性
 */
export function bind(data: BindProductCategorySalePropertyVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/bind',
      data,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 新增销售属性并绑定分类
 */
export function create(data: CreateProductCategorySalePropertyVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl,
      data,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 移除商品分类销售属性配置
 */
export function remove(categoryId: string, propertyId: string): Promise<void> {
  return defHttp.delete<void>(
    {
      url: baseUrl,
      data: {
        categoryId,
        propertyId,
      },
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}
