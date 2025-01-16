import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { QuerySysNotifyGroupBo } from '@/api/system/notify-group/model/querySysNotifyGroupBo';
import { QuerySysNotifyGroupVo } from '@/api/system/notify-group/model/querySysNotifyGroupVo';
import { GetSysNotifyGroupBo } from '@/api/system/notify-group/model/getSysNotifyGroupBo';
import { CreateSysNotifyGroupVo } from '@/api/system/notify-group/model/createSysNotifyGroupVo';
import { UpdateSysNotifyGroupVo } from '@/api/system/notify-group/model/updateSysNotifyGroupVo';
import { SysNotifyGroupSelectorVo } from '@/api/system/notify-group/model/sysNotifyGroupSelectorVo';
import { SysNotifyGroupSelectorBo } from '@/api/system/notify-group/model/sysNotifyGroupSelectorBo';

const baseUrl = '/sys/notify/group';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: SysNotifyGroupSelectorVo,
): Promise<PageResult<SysNotifyGroupSelectorBo>> {
  return defHttp.get<PageResult<SysNotifyGroupSelectorBo>>(
    {
      url: selectorBaseUrl + '/notify/group',
      params,
    },
    {
      region,
    },
  );
}

export function loadNotifyGroup(ids: string[]): Promise<SysNotifyGroupSelectorBo[]> {
  return defHttp.post<SysNotifyGroupSelectorBo[]>(
    {
      url: selectorBaseUrl + '/notify/group/load',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 查询列表
 */
export function query(params: QuerySysNotifyGroupVo): Promise<PageResult<QuerySysNotifyGroupBo>> {
  return defHttp.get<PageResult<QuerySysNotifyGroupBo>>(
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
export function get(id: string): Promise<GetSysNotifyGroupBo> {
  return defHttp.get<GetSysNotifyGroupBo>(
    {
      url: baseUrl + '/detail',
      params: {
        id: id,
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
export function create(data: CreateSysNotifyGroupVo): Promise<void> {
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

/**
 * 修改
 * @param data
 */
export function update(data: UpdateSysNotifyGroupVo): Promise<void> {
  return defHttp.put<void>(
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
