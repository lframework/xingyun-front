import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { QuerySysNoticeVo } from '@/api/system/notice/model/querySysNoticeVo';
import { QuerySysNoticeBo } from '@/api/system/notice/model/querySysNoticeBo';
import { QuerySysNoticeByUserVo } from '@/api/system/notice/model/querySysNoticeByUserVo';
import { QueryMySysNoticeBo } from '@/api/system/notice/model/queryMySysNoticeBo';
import { SysNoticeDto } from '@/api/system/notice/model/sysNoticeDto';
import { GetSysNoticeBo } from '@/api/system/notice/model/getSysNoticeBo';
import { CreateSysNoticeVo } from '@/api/system/notice/model/createSysNoticeVo';
import { UpdateSysNoticeVo } from '@/api/system/notice/model/updateSysNoticeVo';

const baseUrl = '/system/notice';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(params: QuerySysNoticeVo): Promise<PageResult<QuerySysNoticeBo>> {
  return defHttp.get<PageResult<QuerySysNoticeBo>>(
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
 * 查询我的通知
 */
export function queryMyNotice(
  params: QuerySysNoticeByUserVo,
): Promise<PageResult<QueryMySysNoticeBo>> {
  return defHttp.get<PageResult<QueryMySysNoticeBo>>(
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
 * 根据ID查询内容
 * @param id
 */
export function getContent(id: string): Promise<SysNoticeDto> {
  return defHttp.get<SysNoticeDto>(
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
 * @param id
 */
export function get(id: string): Promise<GetSysNoticeBo> {
  return defHttp.get<GetSysNoticeBo>(
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

/**
 * 新增
 * @param data
 */
export function create(data: CreateSysNoticeVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl,
      data,
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 修改
 * @param data
 */
export function update(data: UpdateSysNoticeVo): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl,
      data,
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}
