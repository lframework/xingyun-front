import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { GenDataObjColumnBo } from '@/api/development/data/obj/model/genDataObjColumnBo';
import { QueryGenDataObjBo } from '@/api/development/data/obj/model/queryGenDataObjBo';
import { QueryGenDataObjVo } from '@/api/development/data/obj/model/queryGenDataObjVo';
import { GetGenDataObjBo } from '@/api/development/data/obj/model/getGenDataObjBo';
import { CreateGenDataObjVo } from '@/api/development/data/obj/model/createGenDataObjVo';
import { UpdateGenDataObjVo } from '@/api/development/data/obj/model/updateGenDataObjVo';
import { GenDataObjSelectorVo } from '@/api/development/data/obj/model/genDataObjSelectorVo';
import { GenDataObjSelectorBo } from '@/api/development/data/obj/model/genDataObjSelectorBo';

const baseUrl = '/gen/data/obj';
const selectorBaseUrl = '/selector/gen';
const region = 'cloud-api';

export function selector(params: GenDataObjSelectorVo): Promise<PageResult<GenDataObjSelectorBo>> {
  return defHttp.get<PageResult<GenDataObjSelectorBo>>(
    {
      url: selectorBaseUrl + '/data/obj',
      params,
    },
    {
      region,
    },
  );
}

export function loadDataObj(ids: string[]): Promise<GenDataObjSelectorBo[]> {
  return defHttp.post<GenDataObjSelectorBo[]>(
    {
      url: selectorBaseUrl + '/data/obj/load',
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
export function query(params: QueryGenDataObjVo): Promise<PageResult<QueryGenDataObjBo>> {
  return defHttp.get<PageResult<QueryGenDataObjBo>>(
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
 * 查询列信息
 */
export function getColumns(id: string): Promise<GenDataObjColumnBo[]> {
  return defHttp.get<GenDataObjColumnBo[]>(
    {
      url: baseUrl + '/columns',
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
 * 查询
 */
export function get(id: string): Promise<GetGenDataObjBo> {
  return defHttp.get<GetGenDataObjBo>(
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
export function create(data: CreateGenDataObjVo): Promise<void> {
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
export function update(data: UpdateGenDataObjVo): Promise<void> {
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
