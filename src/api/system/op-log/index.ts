import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { GetOpLogBo } from '@/api/system/op-log/model/getOpLogBo';
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
export function get(id: string): Promise<GetOpLogBo> {
  return defHttp.get<GetOpLogBo>(
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
