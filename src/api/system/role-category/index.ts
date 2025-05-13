import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { QuerySysRoleCategoryBo } from '@/api/system/role-category/model/querySysRoleCategoryBo';
import { GetSysRoleCategoryBo } from '@/api/system/role-category/model/getSysRoleCategoryBo';
import { CreateSysRoleCategoryVo } from '@/api/system/role-category/model/createSysRoleCategoryVo';
import { UpdateSysRoleCategoryVo } from '@/api/system/role-category/model/updateSysRoleCategoryVo';
import { SysRoleSelectorBo } from '@/api/system/role-category/model/sysRoleSelectorBo';
import { SysRoleCategorySelectorVo } from '@/api/system/role-category/model/sysRoleCategorySelectorVo';

const baseUrl = '/sys/role/category';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: SysRoleCategorySelectorVo,
): Promise<PageResult<SysRoleSelectorBo>> {
  return defHttp.get<PageResult<SysRoleSelectorBo>>(
    {
      url: selectorBaseUrl + '/role/category',
      params,
    },
    {
      region,
    },
  );
}

export function loadRoleCategory(ids: string[]): Promise<SysRoleSelectorBo[]> {
  return defHttp.post<SysRoleSelectorBo[]>(
    {
      url: selectorBaseUrl + '/role/category/load',
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
export function query(): Promise<QuerySysRoleCategoryBo[]> {
  return defHttp.get<QuerySysRoleCategoryBo[]>(
    {
      url: baseUrl + '/query',
    },
    {
      region,
    },
  );
}

/**
 * 查询
 */
export function get(id: string): Promise<GetSysRoleCategoryBo> {
  return defHttp.get<GetSysRoleCategoryBo>(
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
export function create(data: CreateSysRoleCategoryVo): Promise<void> {
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
export function update(data: UpdateSysRoleCategoryVo): Promise<void> {
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
 * 删除
 */
export function deleteById(id: string): Promise<void> {
  return defHttp.delete<void>(
    {
      url: baseUrl,
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
