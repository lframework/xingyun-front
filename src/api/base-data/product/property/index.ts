import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { ProductPropertyModelorBo } from '@/api/base-data/product/property/model/productPropertyModelorBo';
import { UpdateProductPropertyVo } from '@/api/base-data/product/property/model/updateProductPropertyVo';
import { CreateProductPropertyVo } from '@/api/base-data/product/property/model/createProductPropertyVo';
import { GetProductPropertyBo } from '@/api/base-data/product/property/model/getProductPropertyBo';
import { QueryProductPropertyVo } from '@/api/base-data/product/property/model/queryProductPropertyVo';
import { QueryProductPropertyBo } from '@/api/base-data/product/property/model/queryProductPropertyBo';
import { RelatedProductCategoryBo } from '@/api/base-data/product/category/model/relatedProductCategoryBo';

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
 * 查询已关联商品分类
 * @param id
 */
export function queryCategories(id: string): Promise<RelatedProductCategoryBo[]> {
  return defHttp.get<RelatedProductCategoryBo[]>(
    {
      url: baseUrl + '/categories',
      params: {
        id,
      },
    },
    {
      region,
    },
  );
}

/**
 * 根据ID删除
 * @param id
 */
export function deleteById(id: string, showError: boolean = false): Promise<void> {
  return defHttp.delete<void>(
    {
      url: baseUrl,
      data: {
        id,
      },
    },
    {
      hiddenError: !showError,
      contentType: ContentTypeEnum.FORM_URLENCODED,
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

/**
 * 下载导入模板
 */
export function downloadImportTemplate(): Promise<void> {
  return defHttp.get<void>(
    {
      url: baseUrl + '/import/template',
    },
    {
      responseType: ResponseEnum.BLOB,
      region,
    },
  );
}

/**
 * 导入
 */
export function importExcel(data: { id: string; file: Blob }): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/import',
      data,
    },
    {
      contentType: ContentTypeEnum.BLOB,
      region,
    },
  );
}
