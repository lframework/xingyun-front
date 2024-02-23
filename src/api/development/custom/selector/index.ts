import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { GenCustomSelectorSelectorBo } from '@/api/development/custom/selector/model/genCustomSelectorSelectorBo';
import { GenCustomSelectorSelectorVo } from '@/api/development/custom/selector/model/genCustomSelectorSelectorVo';
import { QueryGenCustomSelectorVo } from '@/api/development/custom/selector/model/queryGenCustomSelectorVo';
import { QueryGenCustomSelectorBo } from '@/api/development/custom/selector/model/queryGenCustomSelectorBo';
import { GetGenCustomSelectorBo } from '@/api/development/custom/selector/model/getGenCustomSelectorBo';
import { CreateGenCustomSelectorVo } from '@/api/development/custom/selector/model/createGenCustomSelectorVo';
import { UpdateGenCustomSelectorVo } from '@/api/development/custom/selector/model/updateGenCustomSelectorVo';

const baseUrl = '/gen/custom/selector';
const selectorBaseUrl = '/selector/gen';
const region = 'cloud-api';

export function selector(
  params: GenCustomSelectorSelectorVo,
): Promise<PageResult<GenCustomSelectorSelectorBo>> {
  return defHttp.get<PageResult<GenCustomSelectorSelectorBo>>(
    {
      url: selectorBaseUrl + '/custom/selector/category',
      params,
    },
    {
      region,
    },
  );
}

export function loadCustomSelector(ids: string[]): Promise<GenCustomSelectorSelectorBo[]> {
  return defHttp.post<GenCustomSelectorSelectorBo[]>(
    {
      url: selectorBaseUrl + '/custom/selector/category/load',
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
export function query(
  params: QueryGenCustomSelectorVo,
): Promise<PageResult<QueryGenCustomSelectorBo>> {
  return defHttp.get<PageResult<QueryGenCustomSelectorBo>>(
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
export function get(id: string): Promise<GetGenCustomSelectorBo> {
  return defHttp.get<GetGenCustomSelectorBo>(
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
export function create(data: CreateGenCustomSelectorVo): Promise<void> {
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
export function update(data: UpdateGenCustomSelectorVo): Promise<void> {
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
