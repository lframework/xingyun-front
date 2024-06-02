import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { AddressSelectorVo } from '@/api/base-data/address/model/addressSelectorVo';
import { AddressSelectorBo } from '@/api/base-data/address/model/addressSelectorBo';
import { UpdateAddressVo } from '@/api/base-data/address/model/updateAddressVo';
import { CreateAddressVo } from '@/api/base-data/address/model/createAddressVo';
import { GetAddressBo } from '@/api/base-data/address/model/getAddressBo';
import { QueryAddressVo } from '@/api/base-data/address/model/queryAddressVo';
import { QueryAddressBo } from '@/api/base-data/address/model/queryAddressBo';

const baseUrl = '/basedata/address';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(params: AddressSelectorVo): Promise<PageResult<AddressSelectorBo>> {
  return defHttp.get<PageResult<AddressSelectorBo>>(
    {
      url: selectorBaseUrl + '/address',
      params,
    },
    {
      region,
    },
  );
}

export function loadAddress(ids: string[]): Promise<AddressSelectorBo[]> {
  return defHttp.post<AddressSelectorBo[]>(
    {
      url: selectorBaseUrl + '/address/load',
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
export function query(params: QueryAddressVo): Promise<PageResult<QueryAddressBo>> {
  return defHttp.get<PageResult<QueryAddressBo>>(
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
export function get(id: string): Promise<GetAddressBo> {
  return defHttp.get<GetAddressBo>(
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
export function create(data: CreateAddressVo): Promise<void> {
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
export function update(data: UpdateAddressVo): Promise<void> {
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

/**
 * 导出
 */
export function exportList(data: QueryAddressVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/export',
      data,
    },
    {
      responseType: ResponseEnum.BLOB,
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}
