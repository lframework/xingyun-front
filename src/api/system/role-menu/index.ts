import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { QueryRoleMenuBo } from '@/api/system/role-menu/model/queryRoleMenuBo';
import { SysRoleMenuSettingVo } from '@/api/system/role-menu/model/sysRoleMenuSettingVo';

const baseUrl = '/system/role/menu';
const region = 'cloud-api';

/**
 * 查询角色菜单列表
 */
export function menus(roleId: string): Promise<QueryRoleMenuBo[]> {
  return defHttp.get<QueryRoleMenuBo[]>(
    {
      url: baseUrl + '/menus',
      params: {
        roleId,
      },
    },
    {
      region,
    },
  );
}

/**
 * 授权角色菜单
 * @param data
 */
export function setting(data: SysRoleMenuSettingVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/setting',
      data,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}
