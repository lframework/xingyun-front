import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { ProductCategoryPropertyBo } from '@/api/base-data/product/category-property/model/productCategoryPropertyBo';
import { BindProductCategoryPropertyVo } from '@/api/base-data/product/category-property/model/bindProductCategoryPropertyVo';
import { CreateProductCategoryPropertyVo } from '@/api/base-data/product/category-property/model/createProductCategoryPropertyVo';

const baseUrl = '/basedata/product/category/property';
const region = 'cloud-api';

/**
 * 分类属性列表
 */
export function query(categoryId: string): Promise<ProductCategoryPropertyBo[]> {
  return defHttp.get<ProductCategoryPropertyBo[]>(
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
 * 绑定已有属性
 */
export function bind(data: BindProductCategoryPropertyVo): Promise<void> {
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
 * 新增属性并绑定分类
 */
export function create(data: CreateProductCategoryPropertyVo): Promise<void> {
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
 * 移除分类属性
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
