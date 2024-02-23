import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { SysRoleSelectorVo } from '@/api/system/role/model/sysRoleSelectorVo';
import { SysRoleSelectorBo } from '@/api/system/role/model/sysRoleSelectorBo';
import { QuerySysRoleVo } from '@/api/system/role/model/querySysRoleVo';
import { QuerySysRoleBo } from '@/api/system/role/model/querySysRoleBo';
import { GetSysRoleBo } from '@/api/system/role/model/getSysRoleBo';
import { CreateSysRoleVo } from '@/api/system/role/model/createSysRoleVo';
import { UpdateSysRoleVo } from '@/api/system/role/model/updateSysRoleVo';

const baseUrl = '/system/role';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(params: SysRoleSelectorVo): Promise<PageResult<SysRoleSelectorBo>> {
  return defHttp.get<PageResult<SysRoleSelectorBo>>(
    {
      url: selectorBaseUrl + '/role',
      params,
    },
    {
      region,
    },
  );
}

export function loadRole(ids: string[]): Promise<SysRoleSelectorBo[]> {
  return defHttp.post<SysRoleSelectorBo[]>(
    {
      url: selectorBaseUrl + '/role/load',
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
export function query(params: QuerySysRoleVo): Promise<PageResult<QuerySysRoleBo>> {
  return defHttp.get<PageResult<QuerySysRoleBo>>(
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
export function get(id: string): Promise<GetSysRoleBo> {
  return defHttp.get<GetSysRoleBo>(
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
export function create(data: CreateSysRoleVo): Promise<void> {
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
export function update(data: UpdateSysRoleVo): Promise<void> {
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
