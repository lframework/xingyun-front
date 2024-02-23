import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { ProductCategorySelectorBo } from '@/api/base-data/product/category/model/productCategorySelectorBo';
import { QueryProductCategorySelectorVo } from '@/api/base-data/product/category/model/queryProductCategorySelectorVo';
import { ProductCategoryTreeBo } from '@/api/base-data/product/category/model/productCategoryTreeBo';
import { GetProductCategoryBo } from '@/api/base-data/product/category/model/getProductCategoryBo';
import { CreateProductCategoryVo } from '@/api/base-data/product/category/model/createProductCategoryVo';
import { UpdateProductCategoryVo } from '@/api/base-data/product/category/model/updateProductCategoryVo';

const baseUrl = '/basedata/product/category';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: QueryProductCategorySelectorVo,
): Promise<ProductCategorySelectorBo[]> {
  return defHttp.get<ProductCategorySelectorBo[]>(
    {
      url: selectorBaseUrl + '/category',
      params,
    },
    {
      region,
    },
  );
}

export function loadProductCategory(ids: string[]): Promise<ProductCategorySelectorBo[]> {
  return defHttp.post<ProductCategorySelectorBo[]>(
    {
      url: selectorBaseUrl + '/category/load',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 查询列表
 */
export function query(): Promise<ProductCategoryTreeBo[]> {
  return defHttp.get<ProductCategoryTreeBo[]>(
    {
      url: baseUrl + '/query',
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
export function get(id: string): Promise<GetProductCategoryBo> {
  return defHttp.get<GetProductCategoryBo>(
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
export function create(data: CreateProductCategoryVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl,
      data,
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 修改
 * @param data
 */
export function update(data: UpdateProductCategoryVo): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl,
      data,
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
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
