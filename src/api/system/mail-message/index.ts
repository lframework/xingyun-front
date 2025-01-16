import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { QuerySysMailMessageVo } from '@/api/system/mail-message/model/querySysMailMessageVo';
import { QuerySysMailMessageBo } from '@/api/system/mail-message/model/querySysMailMessageBo';
import { GetSysMailMessageBo } from '@/api/system/mail-message/model/getSysMailMessageBo';

const baseUrl = '/system/message/mail';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(params: QuerySysMailMessageVo): Promise<PageResult<QuerySysMailMessageBo>> {
  return defHttp.get<PageResult<QuerySysMailMessageBo>>(
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
 */
export function get(id: string): Promise<GetSysMailMessageBo> {
  return defHttp.get<GetSysMailMessageBo>(
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
