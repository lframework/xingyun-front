import { defHttp } from '@/utils/http/axios';
import { CustomListConfig } from '@/api/development/gen/api/model/customListConfig';
import { PageResult } from '@/api/model/pageResult';
import { DataObjectQueryParamObj } from '@/api/development/gen/api/model/dataObjectQueryParamObj';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { CustomSelectorConfig } from '@/api/development/gen/api/model/customSelectorConfig';
import { CustomFormConfig } from '@/api/development/gen/api/model/customFormConfig';
import { CustomPageConfig } from '@/api/development/gen/api/model/customPageConfig';

const baseUrl = '/gen/api';
const region = 'cloud-api';

/**
 * 自定义列表配置
 */
export function getCustomListConfig(id: string): Promise<CustomListConfig> {
  return defHttp.get<CustomListConfig>(
    {
      url: baseUrl + '/custom/list/config',
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
 * 查询自定义列表数据（分页）
 */
export function customListQueryPage(
  id: string,
  vo: DataObjectQueryParamObj,
): Promise<PageResult<any>> {
  return defHttp.post<PageResult<any>>(
    {
      url: baseUrl + '/custom/list/query',
      params: {
        id,
      },
      data: vo,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 查询自定义列表数据（不分页）
 */
export function customListQueryList(id: string, vo: DataObjectQueryParamObj): Promise<any[]> {
  return defHttp.post<any[]>(
    {
      url: baseUrl + '/custom/list/query/list',
      params: {
        id,
      },
      data: vo,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 查询自定义列表数据（树形）
 */
export function customListQueryTree(id: string, vo: DataObjectQueryParamObj): Promise<any[]> {
  return defHttp.post<any[]>(
    {
      url: baseUrl + '/custom/list/query/tree',
      params: {
        id,
      },
      data: vo,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 自定义选择器配置
 */
export function getCustomSelectorConfig(id: string): Promise<CustomSelectorConfig> {
  return defHttp.get<CustomSelectorConfig>(
    {
      url: baseUrl + '/custom/selector/config',
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
 * 自定义表单配置
 */
export function getCustomFormConfig(id: string): Promise<CustomFormConfig> {
  return defHttp.get<CustomFormConfig>(
    {
      url: baseUrl + '/custom/form/config',
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
 * 查询自定义表单的数据
 */
export function customFormGetData(id: string): Promise<any> {
  return defHttp.post<any>(
    {
      url: baseUrl + '/custom/form/get',
      params: {
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
 * 操作自定义表单的数据
 */
export function customFormHandleData(id: string): Promise<any> {
  return defHttp.post<any>(
    {
      url: baseUrl + '/custom/form/handle',
      params: {
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
 * 自定义页面配置
 */
export function getCustomPageConfig(id: string): Promise<CustomPageConfig> {
  return defHttp.get<CustomPageConfig>(
    {
      url: baseUrl + '/custom/page/config',
      params: {
        id,
      },
    },
    {
      region,
    },
  );
}
