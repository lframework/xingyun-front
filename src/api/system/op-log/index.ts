import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { GetSysPositionBo } from '@/api/system/position/model/getSysPositionBo';
import { QueryOpLogsVo } from '@/api/system/op-log/model/queryOpLogsVo';
import { QueryOpLogBo } from '@/api/system/op-log/model/queryOpLogBo';

const baseUrl = '/system/oplog';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(params: QueryOpLogsVo): Promise<PageResult<QueryOpLogBo>> {
  return defHttp.get<PageResult<QueryOpLogBo>>(
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
export function get(id: string): Promise<GetSysPositionBo> {
  return defHttp.get<GetSysPositionBo>(
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
