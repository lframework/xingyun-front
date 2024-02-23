import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { QueryGenDataEntityCategoryBo } from '@/api/development/data/entity-category/model/queryGenDataEntityCategoryBo';
import { GetGenDataEntityCategoryBo } from '@/api/development/data/entity-category/model/getGenDataEntityCategoryBo';
import { CreateGenDataEntityCategoryVo } from '@/api/development/data/entity-category/model/createGenDataEntityCategoryVo';
import { UpdateGenDataEntityCategoryVo } from '@/api/development/data/entity-category/model/updateGenDataEntityCategoryVo';
import { GenDataEntityCategorySelectorBo } from '@/api/development/data/entity-category/model/genDataEntityCategorySelectorBo';
import { GenDataEntityCategorySelectorVo } from '@/api/development/data/entity-category/model/genDataEntityCategorySelectorVo';

const baseUrl = '/gen/data/entity/category';
const selectorBaseUrl = '/selector/gen';
const region = 'cloud-api';

export function selector(
  params: GenDataEntityCategorySelectorVo,
): Promise<PageResult<GenDataEntityCategorySelectorBo>> {
  return defHttp.get<PageResult<GenDataEntityCategorySelectorBo>>(
    {
      url: selectorBaseUrl + '/data/entity/category',
      params,
    },
    {
      region,
    },
  );
}

export function loadDataEntityCategory(ids: string[]): Promise<GenDataEntityCategorySelectorBo[]> {
  return defHttp.post<GenDataEntityCategorySelectorBo[]>(
    {
      url: selectorBaseUrl + '/data/entity/category/load',
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
export function query(): Promise<QueryGenDataEntityCategoryBo[]> {
  return defHttp.get<QueryGenDataEntityCategoryBo[]>(
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
export function get(id: string): Promise<GetGenDataEntityCategoryBo> {
  return defHttp.get<GetGenDataEntityCategoryBo>(
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
export function create(data: CreateGenDataEntityCategoryVo): Promise<void> {
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
export function update(data: UpdateGenDataEntityCategoryVo): Promise<void> {
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
