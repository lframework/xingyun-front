import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { GenCustomPageCategorySelectorBo } from '@/api/development/custom/page-category/model/genCustomPageCategorySelectorBo';
import { QueryGenCustomPageCategoryBo } from '@/api/development/custom/page-category/model/queryGenCustomPageCategoryBo';
import { GetGenCustomPageCategoryBo } from '@/api/development/custom/page-category/model/getGenCustomPageCategoryBo';
import { UpdateGenCustomPageCategoryVo } from '@/api/development/custom/page-category/model/updateGenCustomPageCategoryVo';
import { CreateGenCustomPageCategoryVo } from '@/api/development/custom/page-category/model/createGenCustomPageCategoryVo';

const baseUrl = '/gen/custom/page/category';
const selectorBaseUrl = '/selector/gen';
const region = 'cloud-api';

export function selector(): Promise<GenCustomPageCategorySelectorBo[]> {
  return defHttp.get<GenCustomPageCategorySelectorBo[]>(
    {
      url: selectorBaseUrl + '/custom/page/category',
    },
    {
      region,
    },
  );
}

export function loadCustomPageCategory(ids: string[]): Promise<GenCustomPageCategorySelectorBo[]> {
  return defHttp.post<GenCustomPageCategorySelectorBo[]>(
    {
      url: selectorBaseUrl + '/custom/page/category/load',
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
export function query(): Promise<QueryGenCustomPageCategoryBo[]> {
  return defHttp.get<QueryGenCustomPageCategoryBo[]>(
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
export function get(id: string): Promise<GetGenCustomPageCategoryBo> {
  return defHttp.get<GetGenCustomPageCategoryBo>(
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
export function create(data: CreateGenCustomPageCategoryVo): Promise<void> {
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
export function update(data: UpdateGenCustomPageCategoryVo): Promise<void> {
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
