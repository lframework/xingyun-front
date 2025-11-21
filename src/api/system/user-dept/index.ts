import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { SysUserDeptSettingVo } from '@/api/system/user-dept/model/sysUserDeptSettingVo';

const baseUrl = '/system/user/dept';
const region = 'cloud-api';

/**
 * 设置部门
 * @param data
 */
export function setting(data: SysUserDeptSettingVo): Promise<void> {
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
