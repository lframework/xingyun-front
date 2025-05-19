import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { QuerySysUserGroupBo } from '@/api/system/user-group/model/querySysUserGroupBo';
import { QuerySysUserGroupVo } from '@/api/system/user-group/model/querySysUserGroupVo';
import { GetSysUserGroupBo } from '@/api/system/user-group/model/getSysUserGroupBo';
import { CreateSysUserGroupVo } from '@/api/system/user-group/model/createSysUserGroupVo';
import { UpdateSysUserGroupVo } from '@/api/system/user-group/model/updateSysUserGroupVo';
import { SysUserGroupSelectorVo } from '@/api/system/user-group/model/sysUserGroupSelectorVo';
import { SysUserGroupSelectorBo } from '@/api/system/user-group/model/sysUserGroupSelectorBo';

const baseUrl = '/sys/user/group';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: SysUserGroupSelectorVo,
): Promise<PageResult<SysUserGroupSelectorBo>> {
  return defHttp.get<PageResult<SysUserGroupSelectorBo>>(
    {
      url: selectorBaseUrl + '/user/group',
      params,
    },
    {
      region,
    },
  );
}

export function loadUserGroup(ids: string[]): Promise<SysUserGroupSelectorBo[]> {
  return defHttp.post<SysUserGroupSelectorBo[]>(
    {
      url: selectorBaseUrl + '/user/group/load',
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
export function query(params: QuerySysUserGroupVo): Promise<PageResult<QuerySysUserGroupBo>> {
  return defHttp.get<PageResult<QuerySysUserGroupBo>>(
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
export function get(id: string): Promise<GetSysUserGroupBo> {
  return defHttp.get<GetSysUserGroupBo>(
    {
      url: baseUrl + '/detail',
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
export function create(data: CreateSysUserGroupVo): Promise<void> {
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
export function update(data: UpdateSysUserGroupVo): Promise<void> {
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
