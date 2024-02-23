import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { SysDataPermissionModelDetailBo } from '@/api/system/data-permission-model-detail/model/sysDataPermissionModelDetailBo';
import { SysDataPermissionModelDetailVo } from '@/api/system/data-permission-model-detail/model/sysDataPermissionModelDetailVo';
import { QuerySysDataPermissionModelDetailBo } from '@/api/system/data-permission-model-detail/model/querySysDataPermissionModelDetailBo';

const baseUrl = '/system/data/permission/model/detail';
const region = 'cloud-api';

/**
 * 根据模型ID查询
 */
export function getByModelId(modelId: number): Promise<SysDataPermissionModelDetailBo[]> {
  return defHttp.get<SysDataPermissionModelDetailBo[]>(
    {
      url: baseUrl,
      params: {
        modelId,
      },
    },
    {
      region,
    },
  );
}

/**
 * 预览SQL
 * @param data
 */
export function preview(
  data: SysDataPermissionModelDetailVo[],
): Promise<SysDataPermissionModelDetailBo[]> {
  return defHttp.post<SysDataPermissionModelDetailBo[]>(
    {
      url: baseUrl + '/preview',
      data,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 根据业务ID查询
 */
export function queryByBizId(
  bizId: string,
  bizType: number,
  permissionType: number,
): Promise<QuerySysDataPermissionModelDetailBo[]> {
  return defHttp.get<QuerySysDataPermissionModelDetailBo[]>(
    {
      url: baseUrl + '/query',
      params: {
        bizId,
        bizType,
        permissionType,
      },
    },
    {
      region,
    },
  );
}
