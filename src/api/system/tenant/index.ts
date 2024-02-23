import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { TenantSelectorVo } from '@/api/system/tenant/model/tenantSelectorVo';
import { TenantSelectorBo } from '@/api/system/tenant/model/tenantSelectorBo';
import { QueryTenantBo } from '@/api/system/tenant/model/queryTenantBo';
import { QueryTenantVo } from '@/api/system/tenant/model/queryTenantVo';
import { GetTenantBo } from '@/api/system/tenant/model/getTenantBo';
import { CreateTenantVo } from '@/api/system/tenant/model/createTenantVo';
import { UpdateTenantVo } from '@/api/system/tenant/model/updateTenantVo';

const baseUrl = '/system/tenant';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(params: TenantSelectorVo): Promise<PageResult<TenantSelectorBo>> {
  return defHttp.get<PageResult<TenantSelectorBo>>(
    {
      url: selectorBaseUrl + '/tenant',
      params,
    },
    {
      region,
    },
  );
}

export function loadTenant(ids: string[]): Promise<TenantSelectorBo[]> {
  return defHttp.post<TenantSelectorBo[]>(
    {
      url: selectorBaseUrl + '/tenant/load',
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
export function query(params: QueryTenantVo): Promise<PageResult<QueryTenantBo>> {
  return defHttp.get<PageResult<QueryTenantBo>>(
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
export function get(id: string): Promise<GetTenantBo> {
  return defHttp.get<GetTenantBo>(
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
 * 新增
 * @param data
 */
export function create(data: CreateTenantVo): Promise<void> {
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
export function update(data: UpdateTenantVo): Promise<void> {
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
