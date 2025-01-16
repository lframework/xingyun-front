import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QueryProductStockWarningBo } from '@/api/sc/stock/warning/model/queryProductStockWarningBo';
import { QueryProductStockWarningVo } from '@/api/sc/stock/warning/model/queryProductStockWarningVo';
import { GetProductStockWarningBo } from '@/api/sc/stock/warning/model/getProductStockWarningBo';
import { CreateProductStockWarningVo } from '@/api/sc/stock/warning/model/createProductStockWarningVo';
import { UpdateProductStockWarningVo } from '@/api/sc/stock/warning/model/updateProductStockWarningVo';
import { GetProductStockWarningNotifyBo } from '@/api/sc/stock/warning/model/getProductStockWarningNotifyBo';

const baseUrl = '/stock/warning';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(
  params: QueryProductStockWarningVo,
): Promise<PageResult<QueryProductStockWarningBo>> {
  return defHttp.get<PageResult<QueryProductStockWarningBo>>(
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
 * 查询详情
 */
export function get(id: string): Promise<GetProductStockWarningBo> {
  return defHttp.get<GetProductStockWarningBo>(
    {
      url: baseUrl + '/detail',
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
 */
export function create(data: CreateProductStockWarningVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl,
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}

/**
 * 修改
 */
export function update(data: UpdateProductStockWarningVo): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl,
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
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
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}

/**
 * 批量删除
 */
export function deleteByIds(ids: string[]): Promise<void> {
  return defHttp.delete<void>(
    {
      url: baseUrl + '/batch',
      data: ids,
    },
    {
      region,
      contentType: ContentTypeEnum.JSON,
    },
  );
}

/**
 * 查询设置的消息通知组
 */
export function getSetting(): Promise<GetProductStockWarningNotifyBo[]> {
  return defHttp.get<GetProductStockWarningNotifyBo[]>(
    {
      url: baseUrl + '/setting',
    },
    {
      region,
    },
  );
}

/**
 * 保存设置的消息通知组
 * @param id
 */
export function createSetting(id: string): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/setting',
      data: {
        id,
      },
    },
    {
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}

/**
 * 删除设置的消息通知组
 * @param id
 */
export function deleteSetting(id: string): Promise<void> {
  return defHttp.delete<void>(
    {
      url: baseUrl + '/setting',
      data: {
        id,
      },
    },
    {
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}
