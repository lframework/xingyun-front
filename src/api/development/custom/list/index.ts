import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { GenCustomListSelectorBo } from '@/api/development/custom/list/model/genCustomListSelectorBo';
import { GenCustomListSelectorVo } from '@/api/development/custom/list/model/genCustomListSelectorVo';
import { QueryGenCustomListVo } from '@/api/development/custom/list/model/queryGenCustomListVo';
import { QueryGenCustomListBo } from '@/api/development/custom/list/model/queryGenCustomListBo';
import { GetGenCustomListBo } from '@/api/development/custom/list/model/getGenCustomListBo';
import { CreateGenCustomListVo } from '@/api/development/custom/list/model/createGenCustomListVo';
import { UpdateGenCustomListVo } from '@/api/development/custom/list/model/updateGenCustomListVo';

const baseUrl = '/gen/custom/list';
const selectorBaseUrl = '/selector/gen';
const region = 'cloud-api';

export function selector(
  params: GenCustomListSelectorVo,
): Promise<PageResult<GenCustomListSelectorBo>> {
  return defHttp.get<PageResult<GenCustomListSelectorBo>>(
    {
      url: selectorBaseUrl + '/custom/list',
      params,
    },
    {
      region,
    },
  );
}

export function loadCustomList(ids: string[]): Promise<GenCustomListSelectorBo[]> {
  return defHttp.post<GenCustomListSelectorBo[]>(
    {
      url: selectorBaseUrl + '/custom/list/load',
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
export function query(params: QueryGenCustomListVo): Promise<PageResult<QueryGenCustomListBo>> {
  return defHttp.get<PageResult<QueryGenCustomListBo>>(
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
 * 查询
 */
export function get(id: string): Promise<GetGenCustomListBo> {
  return defHttp.get<GetGenCustomListBo>(
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
export function create(data: CreateGenCustomListVo): Promise<void> {
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
export function update(data: UpdateGenCustomListVo): Promise<void> {
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

/**
 * 删除
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

/**
 * 批量删除
 */
export function batchDelete(ids: string[]): Promise<void> {
  return defHttp.delete<void>(
    {
      url: baseUrl + '/batch',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 批量停用
 * @param ids
 */
export function batchUnable(ids: string[]): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/unable/batch',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 批量启用
 * @param ids
 */
export function batchEnable(ids: string[]): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/enable/batch',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}
