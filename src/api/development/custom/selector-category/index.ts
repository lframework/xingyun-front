import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { GenCustomSelectorCategorySelectorBo } from '@/api/development/custom/selector-category/model/genCustomSelectorCategorySelectorBo';
import { GenCustomSelectorCategorySelectorVo } from '@/api/development/custom/selector-category/model/genCustomSelectorCategorySelectorVo';
import { GetGenCustomSelectorCategoryBo } from '@/api/development/custom/selector-category/model/getGenCustomSelectorCategoryBo';
import { QueryGenCustomSelectorCategoryBo } from '@/api/development/custom/selector-category/model/queryGenCustomSelectorCategoryBo';
import { CreateGenCustomSelectorCategoryVo } from '@/api/development/custom/selector-category/model/createGenCustomSelectorCategoryVo';
import { UpdateGenCustomSelectorCategoryVo } from '@/api/development/custom/selector-category/model/updateGenCustomSelectorCategoryVo';

const baseUrl = '/gen/custom/selector/category';
const selectorBaseUrl = '/selector/gen';
const region = 'cloud-api';

export function selector(
  params: GenCustomSelectorCategorySelectorVo,
): Promise<PageResult<GenCustomSelectorCategorySelectorBo>> {
  return defHttp.get<PageResult<GenCustomSelectorCategorySelectorBo>>(
    {
      url: selectorBaseUrl + '/custom/selector/category',
      params,
    },
    {
      region,
    },
  );
}

export function loadCustomSelectorCategory(
  ids: string[],
): Promise<GenCustomSelectorCategorySelectorBo[]> {
  return defHttp.post<GenCustomSelectorCategorySelectorBo[]>(
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
export function query(): Promise<QueryGenCustomSelectorCategoryBo[]> {
  return defHttp.get<QueryGenCustomSelectorCategoryBo[]>(
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
export function get(id: string): Promise<GetGenCustomSelectorCategoryBo> {
  return defHttp.get<GetGenCustomSelectorCategoryBo>(
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
export function create(data: CreateGenCustomSelectorCategoryVo): Promise<void> {
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
export function update(data: UpdateGenCustomSelectorCategoryVo): Promise<void> {
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
