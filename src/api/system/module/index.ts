import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { QuerySysModuleBo } from '@/api/system/module/model/querySysModuleBo';
import { SysModuleTenantVo } from '@/api/system/module/model/sysModuleTenantVo';

const baseUrl = '/system/module';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(tenantId: number): Promise<QuerySysModuleBo[]> {
  return defHttp.get<QuerySysModuleBo[]>(
    {
      url: baseUrl + '/query',
      params: {
        tenantId,
      },
    },
    {
      region,
    },
  );
}

/**
 * 模块授权
 * @param data
 */
export function setting(data: SysModuleTenantVo): Promise<void> {
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
