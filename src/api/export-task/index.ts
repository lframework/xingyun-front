import { defHttp } from '/@/utils/http/axios';
import { ExportingExportTaskBo } from '@/api/export-task/model/exportingExportTaskBo';
import { SuccessExportTaskBo } from '@/api/export-task/model/successExportTaskBo';
import { PageResult } from '@/api/model/pageResult';
import { QuerySuccessExportTaskVo } from '@/api/export-task/model/querySuccessExportTaskVo';
import { FailExportTaskBo } from '@/api/export-task/model/failExportTaskBo';
import { QueryFailExportTaskVo } from '@/api/export-task/model/queryFailExportTaskVo';

const baseUrl = '/export/task';
const region = 'cloud-api';

/**
 * 正在导出列表
 */
export function queryExporting(): Promise<ExportingExportTaskBo[]> {
  return defHttp.get<ExportingExportTaskBo[]>(
    {
      url: baseUrl + '/exporting',
    },
    {
      errorMessageMode: 'none',
      region,
    },
  );
}

/**
 * 导出成功列表
 */
export function querySuccess(
  params: QuerySuccessExportTaskVo,
): Promise<PageResult<SuccessExportTaskBo>> {
  return defHttp.get<PageResult<SuccessExportTaskBo>>(
    {
      url: baseUrl + '/success',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 导出失败列表
 */
export function queryFail(params: QueryFailExportTaskVo): Promise<PageResult<FailExportTaskBo>> {
  return defHttp.get<PageResult<FailExportTaskBo>>(
    {
      url: baseUrl + '/fail',
      params,
    },
    {
      region,
    },
  );
}
