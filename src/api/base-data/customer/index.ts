import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { QueryCustomerSelectorVo } from '@/api/base-data/customer/model/queryCustomerSelectorVo';
import { CustomerSelectorBo } from '@/api/base-data/customer/model/customerSelectorBo';
import { UpdateCustomerVo } from '@/api/base-data/customer/model/updateCustomerVo';
import { CreateCustomerVo } from '@/api/base-data/customer/model/createCustomerVo';
import { GetCustomerBo } from '@/api/base-data/customer/model/getCustomerBo';
import { QueryCustomerVo } from '@/api/base-data/customer/model/queryCustomerVo';
import { QueryCustomerBo } from '@/api/base-data/customer/model/queryCustomerBo';

const baseUrl = '/basedata/customer';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(params: QueryCustomerSelectorVo): Promise<PageResult<CustomerSelectorBo>> {
  return defHttp.get<PageResult<CustomerSelectorBo>>(
    {
      url: selectorBaseUrl + '/customer',
      params,
    },
    {
      region,
    },
  );
}

export function loadCustomer(ids: string[]): Promise<CustomerSelectorBo[]> {
  return defHttp.post<CustomerSelectorBo[]>(
    {
      url: selectorBaseUrl + '/customer/load',
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
export function query(params: QueryCustomerVo): Promise<PageResult<QueryCustomerBo>> {
  return defHttp.get<PageResult<QueryCustomerBo>>(
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
export function get(id: string): Promise<GetCustomerBo> {
  return defHttp.get<GetCustomerBo>(
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
 * 停用
 * @param id
 */
export function unable(id: string): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/unable',
      data: {
        id,
      },
    },
    {
      errorMessageMode: 'none',
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 启用
 * @param id
 */
export function enable(id: string): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/enable',
      data: {
        id,
      },
    },
    {
      errorMessageMode: 'none',
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 新增
 * @param data
 */
export function create(data: CreateCustomerVo): Promise<void> {
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
export function update(data: UpdateCustomerVo): Promise<void> {
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
