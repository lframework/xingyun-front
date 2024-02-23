import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { QuerySysUserVo } from '@/api/system/user/model/querySysUserVo';
import { QuerySysUserBo } from '@/api/system/user/model/querySysUserBo';
import { GetSysUserBo } from '@/api/system/user/model/getSysUserBo';
import { CreateSysUserVo } from '@/api/system/user/model/createSysUserVo';
import { UpdateSysUserVo } from '@/api/system/user/model/updateSysUserVo';
import { SysUserSelectorVo } from '@/api/system/user/model/sysUserSelectorVo';
import { SysUserSelectorBo } from '@/api/system/user/model/sysUserSelectorBo';

const baseUrl = '/system/user';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(params: SysUserSelectorVo): Promise<PageResult<SysUserSelectorBo>> {
  return defHttp.get<PageResult<SysUserSelectorBo>>(
    {
      url: selectorBaseUrl + '/user',
      params,
    },
    {
      region,
    },
  );
}

export function loadUser(ids: string[]): Promise<SysUserSelectorBo[]> {
  return defHttp.post<SysUserSelectorBo[]>(
    {
      url: selectorBaseUrl + '/user/load',
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
export function query(params: QuerySysUserVo): Promise<PageResult<QuerySysUserBo>> {
  return defHttp.get<PageResult<QuerySysUserBo>>(
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
export function get(id: string): Promise<GetSysUserBo> {
  return defHttp.get<GetSysUserBo>(
    {
      url: baseUrl,
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
 * 新增
 * @param data
 */
export function create(data: CreateSysUserVo): Promise<void> {
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
export function update(data: UpdateSysUserVo): Promise<void> {
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
 * 解锁用户
 * @param id
 */
export function unlock(id: string): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/unlock',
      data: {
        id,
      },
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}
