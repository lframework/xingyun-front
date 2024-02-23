import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { QueryProductBrandSelectorVo } from '@/api/base-data/product/brand/model/queryProductBrandSelectorVo';
import { ProductBrandSelectorBo } from '@/api/base-data/product/brand/model/productBrandSelectorBo';
import { QueryProductBrandVo } from '@/api/base-data/product/brand/model/queryProductBrandVo';
import { QueryProductBrandBo } from '@/api/base-data/product/brand/model/queryProductBrandBo';
import { GetProductBrandBo } from '@/api/base-data/product/brand/model/getProductBrandBo';
import { CreateProductBrandVo } from '@/api/base-data/product/brand/model/createProductBrandVo';
import { UpdateProductBrandVo } from '@/api/base-data/product/brand/model/updateProductBrandVo';

const baseUrl = '/basedata/product/brand';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: QueryProductBrandSelectorVo,
): Promise<PageResult<ProductBrandSelectorBo>> {
  return defHttp.get<PageResult<ProductBrandSelectorBo>>(
    {
      url: selectorBaseUrl + '/brand',
      params,
    },
    {
      region,
    },
  );
}

export function loadProductBrand(ids: string[]): Promise<ProductBrandSelectorBo[]> {
  return defHttp.post<ProductBrandSelectorBo[]>(
    {
      url: selectorBaseUrl + '/brand/load',
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
export function query(params: QueryProductBrandVo): Promise<PageResult<QueryProductBrandBo>> {
  return defHttp.get<PageResult<QueryProductBrandBo>>(
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
export function get(id: string): Promise<GetProductBrandBo> {
  return defHttp.get<GetProductBrandBo>(
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
export function create(data: CreateProductBrandVo): Promise<void> {
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
export function update(data: UpdateProductBrandVo): Promise<void> {
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
