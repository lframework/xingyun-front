import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { ProductPropertyModelorBo } from '@/api/base-data/product/property/model/productPropertyModelorBo';
import { UpdateProductPropertyVo } from '@/api/base-data/product/property/model/updateProductPropertyVo';
import { CreateProductPropertyVo } from '@/api/base-data/product/property/model/createProductPropertyVo';
import { GetProductPropertyBo } from '@/api/base-data/product/property/model/getProductPropertyBo';
import { QueryProductPropertyVo } from '@/api/base-data/product/property/model/queryProductPropertyVo';
import { QueryProductPropertyBo } from '@/api/base-data/product/property/model/queryProductPropertyBo';

const baseUrl = '/basedata/product/property';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(params: QueryProductPropertyVo): Promise<PageResult<QueryProductPropertyBo>> {
  return defHttp.get<PageResult<QueryProductPropertyBo>>(
    {
      url: baseUrl + '/query',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 根据ID查询
 * @param id
 */
export function get(id: string): Promise<GetProductPropertyBo> {
  return defHttp.get<GetProductPropertyBo>(
    {
      url: baseUrl,
      params: {
        id: id,
      },
    },
    {
      region,
    },
  );
}

/**
 * 批量停用
 * @param ids
 */
export function batchUnable(ids: string[]): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/unable/batch',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 批量启用
 * @param ids
 */
export function batchEnable(ids: string[]): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/enable/batch',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 新增
 * @param data
 */
export function create(data: CreateProductPropertyVo): Promise<void> {
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
 * 修改
 * @param data
 */
export function update(data: UpdateProductPropertyVo): Promise<void> {
  return defHttp.put<void>(
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
 * 属性模型
 */
export function getModelorByCategory(categoryId: string): Promise<ProductPropertyModelorBo[]> {
  return defHttp.get<ProductPropertyModelorBo[]>(
    {
      url: baseUrl + '/modelor/category',
      params: {
        categoryId,
      },
    },
    {
      region,
    },
  );
}
