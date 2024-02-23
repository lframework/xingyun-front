import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { QueryGenDataObjCategoryBo } from '@/api/development/data/obj-category/model/queryGenDataObjCategoryBo';
import { GetGenDataObjCategoryBo } from '@/api/development/data/obj-category/model/getGenDataObjCategoryBo';
import { CreateGenDataObjCategoryVo } from '@/api/development/data/obj-category/model/createGenDataObjCategoryVo';
import { UpdateGenDataObjCategoryVo } from '@/api/development/data/obj-category/model/updateGenDataObjCategoryVo';
import { GenDataObjCategorySelectorBo } from '@/api/development/data/obj-category/model/genDataObjCategorySelectorBo';
import { GenDataObjCategorySelectorVo } from '@/api/development/data/obj-category/model/genDataObjCategorySelectorVo';

const baseUrl = '/gen/data/obj/category';
const selectorBaseUrl = '/selector/gen';
const region = 'cloud-api';

export function selector(
  params: GenDataObjCategorySelectorVo,
): Promise<PageResult<GenDataObjCategorySelectorBo>> {
  return defHttp.get<PageResult<GenDataObjCategorySelectorBo>>(
    {
      url: selectorBaseUrl + '/data/obj/category',
      params,
    },
    {
      region,
    },
  );
}

export function loadDataObjCategory(ids: string[]): Promise<GenDataObjCategorySelectorBo[]> {
  return defHttp.post<GenDataObjCategorySelectorBo[]>(
    {
      url: selectorBaseUrl + '/data/obj/category/load',
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
export function query(): Promise<QueryGenDataObjCategoryBo[]> {
  return defHttp.get<QueryGenDataObjCategoryBo[]>(
    {
      url: baseUrl + '/query',
    },
    {
      region,
    },
  );
}

/**
 * 查询
 */
export function get(id: string): Promise<GetGenDataObjCategoryBo> {
  return defHttp.get<GetGenDataObjCategoryBo>(
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
export function create(data: CreateGenDataObjCategoryVo): Promise<void> {
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
export function update(data: UpdateGenDataObjCategoryVo): Promise<void> {
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
