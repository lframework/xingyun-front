import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { QueryStoreCenterSelectorVo } from '@/api/base-data/store-center/model/queryStoreCenterSelectorVo';
import { StoreCenterSelectorBo } from '@/api/base-data/store-center/model/storeCenterSelectorBo';
import { QueryStoreCenterBo } from '@/api/base-data/store-center/model/queryStoreCenterBo';
import { QueryStoreCenterVo } from '@/api/base-data/store-center/model/queryStoreCenterVo';
import { GetStoreCenterBo } from '@/api/base-data/store-center/model/getStoreCenterBo';
import { CreateStoreCenterVo } from '@/api/base-data/store-center/model/createStoreCenterVo';
import { UpdateStoreCenterVo } from '@/api/base-data/store-center/model/updateStoreCenterVo';

const baseUrl = '/basedata/storecenter';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: QueryStoreCenterSelectorVo,
): Promise<PageResult<StoreCenterSelectorBo>> {
  return defHttp.get<PageResult<StoreCenterSelectorBo>>(
    {
      url: selectorBaseUrl + '/sc',
      params,
    },
    {
      region,
    },
  );
}

export function loadSc(ids: string[]): Promise<StoreCenterSelectorBo[]> {
  return defHttp.post<StoreCenterSelectorBo[]>(
    {
      url: selectorBaseUrl + '/sc/load',
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
export function query(params: QueryStoreCenterVo): Promise<PageResult<QueryStoreCenterBo>> {
  return defHttp.get<PageResult<QueryStoreCenterBo>>(
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
export function get(id: string): Promise<GetStoreCenterBo> {
  return defHttp.get<GetStoreCenterBo>(
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
export function create(data: CreateStoreCenterVo): Promise<void> {
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
export function update(data: UpdateStoreCenterVo): Promise<void> {
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
