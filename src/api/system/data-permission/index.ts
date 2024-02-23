import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { CreateSysDataPermissionDataVo } from '@/api/system/data-permission/model/createSysDataPermissionDataVo';

const baseUrl = '/system/data/permission/data';
const region = 'cloud-api';

/**
 * 保存
 */
export function save(data: CreateSysDataPermissionDataVo[]): Promise<void> {
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
