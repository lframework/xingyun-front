import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { QuerySupplierSelectorVo } from '@/api/base-data/supplier/model/querySupplierSelectorVo';
import { SupplierSelectorBo } from '@/api/base-data/supplier/model/supplierSelectorBo';
import { UpdateSupplierVo } from '@/api/base-data/supplier/model/updateSupplierVo';
import { CreateSupplierVo } from '@/api/base-data/supplier/model/createSupplierVo';
import { GetSupplierBo } from '@/api/base-data/supplier/model/getSupplierBo';
import { QuerySupplierVo } from '@/api/base-data/supplier/model/querySupplierVo';
import { QuerySupplierBo } from '@/api/base-data/supplier/model/querySupplierBo';

const baseUrl = '/basedata/supplier';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(params: QuerySupplierSelectorVo): Promise<PageResult<SupplierSelectorBo>> {
  return defHttp.get<PageResult<SupplierSelectorBo>>(
    {
      url: selectorBaseUrl + '/supplier',
      params,
    },
    {
      region,
    },
  );
}

export function loadSupplier(ids: string[]): Promise<SupplierSelectorBo[]> {
  return defHttp.post<SupplierSelectorBo[]>(
    {
      url: selectorBaseUrl + '/supplier/load',
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
export function query(params: QuerySupplierVo): Promise<PageResult<QuerySupplierBo>> {
  return defHttp.get<PageResult<QuerySupplierBo>>(
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
export function get(id: string): Promise<GetSupplierBo> {
  return defHttp.get<GetSupplierBo>(
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
export function create(data: CreateSupplierVo): Promise<void> {
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
export function update(data: UpdateSupplierVo): Promise<void> {
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
