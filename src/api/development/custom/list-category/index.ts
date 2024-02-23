import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { GenCustomListCategorySelectorVo } from '@/api/development/custom/list-category/model/genCustomListCategorySelectorVo';
import { GenCustomListCategorySelectorBo } from '@/api/development/custom/list-category/model/genCustomListCategorySelectorBo';
import { QueryGenCustomListCategoryBo } from '@/api/development/custom/list-category/model/queryGenCustomListCategoryBo';
import { GetGenCustomListCategoryBo } from '@/api/development/custom/list-category/model/getGenCustomListCategoryBo';
import { UpdateGenCustomListCategoryVo } from '@/api/development/custom/list-category/model/updateGenCustomListCategoryVo';
import { CreateGenCustomListCategoryVo } from '@/api/development/custom/list-category/model/createGenCustomListCategoryVo';

const baseUrl = '/gen/custom/list/category';
const selectorBaseUrl = '/selector/gen';
const region = 'cloud-api';

export function selector(
  params: GenCustomListCategorySelectorVo,
): Promise<PageResult<GenCustomListCategorySelectorBo>> {
  return defHttp.get<PageResult<GenCustomListCategorySelectorBo>>(
    {
      url: selectorBaseUrl + '/custom/list/category',
      params,
    },
    {
      region,
    },
  );
}

export function loadCustomListCategory(ids: string[]): Promise<GenCustomListCategorySelectorBo[]> {
  return defHttp.post<GenCustomListCategorySelectorBo[]>(
    {
      url: selectorBaseUrl + '/custom/list/category/load',
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
export function query(): Promise<QueryGenCustomListCategoryBo[]> {
  return defHttp.get<QueryGenCustomListCategoryBo[]>(
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
export function get(id: string): Promise<GetGenCustomListCategoryBo> {
  return defHttp.get<GetGenCustomListCategoryBo>(
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
export function create(data: CreateGenCustomListCategoryVo): Promise<void> {
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
export function update(data: UpdateGenCustomListCategoryVo): Promise<void> {
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
