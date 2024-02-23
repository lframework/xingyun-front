import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { SysDataDicCategorySelectorVo } from '@/api/system/dic-category/model/sysDataDicCategorySelectorVo';
import { SysDataDicCategorySelectorBo } from '@/api/system/dic-category/model/sysDataDicCategorySelectorBo';
import { QuerySysDataDicCategoryBo } from '@/api/system/dic-category/model/querySysDataDicCategoryBo';
import { GetSysDataDicCategoryBo } from '@/api/system/dic-category/model/getSysDataDicCategoryBo';
import { CreateSysDataDicCategoryVo } from '@/api/system/dic-category/model/createSysDataDicCategoryVo';
import { UpdateSysDataDicCategoryVo } from '@/api/system/dic-category/model/updateSysDataDicCategoryVo';

const baseUrl = '/system/dic/category';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: SysDataDicCategorySelectorVo,
): Promise<PageResult<SysDataDicCategorySelectorBo>> {
  return defHttp.get<PageResult<SysDataDicCategorySelectorBo>>(
    {
      url: selectorBaseUrl + '/dic/category',
      params,
    },
    {
      region,
    },
  );
}

export function loadDataDicCategory(ids: string[]): Promise<SysDataDicCategorySelectorBo[]> {
  return defHttp.post<SysDataDicCategorySelectorBo[]>(
    {
      url: selectorBaseUrl + '/dic/category/load',
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
export function query(): Promise<QuerySysDataDicCategoryBo[]> {
  return defHttp.get<QuerySysDataDicCategoryBo[]>(
    {
      url: baseUrl + '/query',
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
export function get(id: string): Promise<GetSysDataDicCategoryBo> {
  return defHttp.get<GetSysDataDicCategoryBo>(
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
export function create(data: CreateSysDataDicCategoryVo): Promise<void> {
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
export function update(data: UpdateSysDataDicCategoryVo): Promise<void> {
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
