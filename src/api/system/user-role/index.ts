import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { SysUserRoleSettingVo } from '@/api/system/user-role/model/sysUserRoleSettingVo';

const baseUrl = '/system/user/role';
const region = 'cloud-api';

/**
 * 设置角色
 * @param data
 */
export function setting(data: SysUserRoleSettingVo): Promise<void> {
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
