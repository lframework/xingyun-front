import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { GenCustomPageSelectorBo } from '@/api/development/custom/page/model/genCustomPageSelectorBo';
import { GenCustomPageSelectorVo } from '@/api/development/custom/page/model/genCustomPageSelectorVo';
import { QueryGenCustomPageVo } from '@/api/development/custom/page/model/queryGenCustomPageVo';
import { QueryGenCustomPageBo } from '@/api/development/custom/page/model/queryGenCustomPageBo';
import { GetGenCustomPageBo } from '@/api/development/custom/page/model/getGenCustomPageBo';
import { CreateGenCustomPageVo } from '@/api/development/custom/page/model/createGenCustomPageVo';
import { UpdateGenCustomPageVo } from '@/api/development/custom/page/model/updateGenCustomPageVo';

const baseUrl = '/gen/custom/page';
const selectorBaseUrl = '/selector/gen';
const region = 'cloud-api';

export function selector(
  params: GenCustomPageSelectorVo,
): Promise<PageResult<GenCustomPageSelectorBo>> {
  return defHttp.get<PageResult<GenCustomPageSelectorBo>>(
    {
      url: selectorBaseUrl + '/custom/page',
      params,
    },
    {
      region,
    },
  );
}

export function loadCustomPage(ids: string[]): Promise<GenCustomPageSelectorBo[]> {
  return defHttp.post<GenCustomPageSelectorBo[]>(
    {
      url: selectorBaseUrl + '/custom/page/load',
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
export function query(params: QueryGenCustomPageVo): Promise<PageResult<QueryGenCustomPageBo>> {
  return defHttp.get<PageResult<QueryGenCustomPageBo>>(
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
export function get(id: string): Promise<GetGenCustomPageBo> {
  return defHttp.get<GetGenCustomPageBo>(
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
export function create(data: CreateGenCustomPageVo): Promise<void> {
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
export function update(data: UpdateGenCustomPageVo): Promise<void> {
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
