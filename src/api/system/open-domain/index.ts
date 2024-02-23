import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { SysOpenDomainSelectorBo } from '@/api/system/open-domain/model/sysOpenDomainSelectorBo';
import { SysOpenDomainSelectorVo } from '@/api/system/open-domain/model/sysOpenDomainSelectorVo';
import { QuerySysOpenDomainBo } from '@/api/system/open-domain/model/querySysOpenDomainBo';
import { QuerySysOpenDomainVo } from '@/api/system/open-domain/model/querySysOpenDomainVo';
import { GetSysOpenDomainBo } from '@/api/system/open-domain/model/getSysOpenDomainBo';
import { CreateSysOpenDomainVo } from '@/api/system/open-domain/model/createSysOpenDomainVo';
import { UpdateSysOpenDomainVo } from '@/api/system/open-domain/model/updateSysOpenDomainVo';
import { UpdateSysOpenDomainSecretVo } from '@/api/system/open-domain/model/updateSysOpenDomainSecretVo';

const baseUrl = '/system/open/domain';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: SysOpenDomainSelectorVo,
): Promise<PageResult<SysOpenDomainSelectorBo>> {
  return defHttp.get<PageResult<SysOpenDomainSelectorBo>>(
    {
      url: selectorBaseUrl + '/openDomain',
      params,
    },
    {
      region,
    },
  );
}

export function loadOpenDomain(ids: string[]): Promise<SysOpenDomainSelectorBo[]> {
  return defHttp.post<SysOpenDomainSelectorBo[]>(
    {
      url: selectorBaseUrl + '/openDomain/load',
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
export function query(params: QuerySysOpenDomainVo): Promise<PageResult<QuerySysOpenDomainBo>> {
  return defHttp.get<PageResult<QuerySysOpenDomainBo>>(
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
export function get(id: string): Promise<GetSysOpenDomainBo> {
  return defHttp.get<GetSysOpenDomainBo>(
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
export function create(data: CreateSysOpenDomainVo): Promise<void> {
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
export function update(data: UpdateSysOpenDomainVo): Promise<void> {
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
 * 修改Api密钥
 * @param data
 */
export function updateSecret(data: UpdateSysOpenDomainSecretVo): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl + '/secret',
      data,
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}
