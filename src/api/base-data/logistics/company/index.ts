import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { UpdateLogisticsCompanyVo } from '@/api/base-data/logistics/company/model/updateLogisticsCompanyVo';
import { CreateLogisticsCompanyVo } from '@/api/base-data/logistics/company/model/createLogisticsCompanyVo';
import { GetLogisticsCompanyBo } from '@/api/base-data/logistics/company/model/getLogisticsCompanyBo';
import { QueryLogisticsCompanyVo } from '@/api/base-data/logistics/company/model/queryLogisticsCompanyVo';
import { QueryLogisticsCompanyBo } from '@/api/base-data/logistics/company/model/queryLogisticsCompanyBo';
import { LogisticsCompanySelectorBo } from '@/api/base-data/logistics/company/model/logisticsCompanySelectorBo';
import { QueryLogisticsCompanySelectorVo } from '@/api/base-data/logistics/company/model/queryLogisticsCompanySelectorVo';

const baseUrl = '/basedata/logistics/company';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: QueryLogisticsCompanySelectorVo,
): Promise<PageResult<LogisticsCompanySelectorBo>> {
  return defHttp.get<PageResult<LogisticsCompanySelectorBo>>(
    {
      url: selectorBaseUrl + '/logistics/company',
      params,
    },
    {
      region,
    },
  );
}

export function loadLogisticsCompany(ids: string[]): Promise<LogisticsCompanySelectorBo[]> {
  return defHttp.post<LogisticsCompanySelectorBo[]>(
    {
      url: selectorBaseUrl + '/logistics/company/load',
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
  params: QueryLogisticsCompanyVo,
): Promise<PageResult<QueryLogisticsCompanyBo>> {
  return defHttp.get<PageResult<QueryLogisticsCompanyBo>>(
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
 * 根据ID查询
 * @param id
 */
export function get(id: string): Promise<GetLogisticsCompanyBo> {
  return defHttp.get<GetLogisticsCompanyBo>(
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

/**
 * 新增
 * @param data
 */
export function create(data: CreateLogisticsCompanyVo): Promise<void> {
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
export function update(data: UpdateLogisticsCompanyVo): Promise<void> {
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
