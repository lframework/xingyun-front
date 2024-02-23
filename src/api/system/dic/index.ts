import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { SysDataDicSelectorVo } from '@/api/system/dic/model/sysDataDicSelectorVo';
import { SysDataDicSelectorBo } from '@/api/system/dic/model/sysDataDicSelectorBo';
import { QuerySysDataDicVo } from '@/api/system/dic/model/querySysDataDicVo';
import { QuerySysDataDicBo } from '@/api/system/dic/model/querySysDataDicBo';
import { GetSysDataDicBo } from '@/api/system/dic/model/getSysDataDicBo';
import { CreateSysDataDicVo } from '@/api/system/dic/model/createSysDataDicVo';
import { UpdateSysDataDicVo } from '@/api/system/dic/model/updateSysDataDicVo';

const baseUrl = '/system/dic';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(params: SysDataDicSelectorVo): Promise<PageResult<SysDataDicSelectorBo>> {
  return defHttp.get<PageResult<SysDataDicSelectorBo>>(
    {
      url: selectorBaseUrl + '/dic',
      params,
    },
    {
      region,
    },
  );
}

export function loadDataDic(ids: string[]): Promise<SysDataDicSelectorBo[]> {
  return defHttp.post<SysDataDicSelectorBo[]>(
    {
      url: selectorBaseUrl + '/dic/load',
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
export function query(params: QuerySysDataDicVo): Promise<PageResult<QuerySysDataDicBo>> {
  return defHttp.get<PageResult<QuerySysDataDicBo>>(
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
export function get(id: string): Promise<GetSysDataDicBo> {
  return defHttp.get<GetSysDataDicBo>(
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

/**
 * 新增
 * @param data
 */
export function create(data: CreateSysDataDicVo): Promise<void> {
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
export function update(data: UpdateSysDataDicVo): Promise<void> {
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

/**
 * 根据ID删除
 * @param data
 */
export function deleteById(id: string): Promise<void> {
  return defHttp.delete<void>(
    {
      url: baseUrl,
      data: {
        id,
      },
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}
