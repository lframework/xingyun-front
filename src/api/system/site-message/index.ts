import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { QuerySysSiteMessageBo } from '@/api/system/site-message/model/querySysSiteMessageBo';
import { QuerySysSiteMessageVo } from '@/api/system/site-message/model/querySysSiteMessageVo';
import { QuerySysSiteMessageByUserVo } from '@/api/system/site-message/model/querySysSiteMessageByUserVo';
import { QueryMySysSiteMessageBo } from '@/api/system/site-message/model/queryMySysSiteMessageBo';
import { SiteMessageDto } from '@/api/system/site-message/model/siteMessageDto';
import {GetSysSiteMessageBo} from "@/api/system/site-message/model/getSysSiteMessageBo";

const baseUrl = '/system/message/site';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(params: QuerySysSiteMessageVo): Promise<PageResult<QuerySysSiteMessageBo>> {
  return defHttp.get<PageResult<QuerySysSiteMessageBo>>(
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
 * 查询我的站内信
 */
export function queryMy(
  params: QuerySysSiteMessageByUserVo,
): Promise<PageResult<QueryMySysSiteMessageBo>> {
  return defHttp.get<PageResult<QueryMySysSiteMessageBo>>(
    {
      url: baseUrl + '/query/my',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 查询内容
 */
export function getContent(id: string): Promise<SiteMessageDto> {
  return defHttp.get<SiteMessageDto>(
    {
      url: baseUrl + '/content',
      params: {
        id,
      },
    },
    {
      region,
    },
  );
}

/**
 * 根据ID查询
 */
export function get(id: string): Promise<GetSysSiteMessageBo> {
  return defHttp.get<GetSysSiteMessageBo>(
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
