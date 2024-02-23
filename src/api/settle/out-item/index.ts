import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { SettleOutItemSelectorVo } from '@/api/settle/out-item/model/settleOutItemSelectorVo';
import { SettleOutItemSelectorBo } from '@/api/settle/out-item/model/settleOutItemSelectorBo';
import { QuerySettleOutItemBo } from '@/api/settle/out-item/model/querySettleOutItemBo';
import { QuerySettleOutItemVo } from '@/api/settle/out-item/model/querySettleOutItemVo';
import { GetSettleOutItemBo } from '@/api/settle/out-item/model/getSettleOutItemBo';
import { CreateSettleOutItemVo } from '@/api/settle/out-item/model/createSettleOutItemVo';
import { UpdateSettleOutItemVo } from '@/api/settle/out-item/model/updateSettleOutItemVo';

const baseUrl = '/settle/item/out';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: SettleOutItemSelectorVo,
): Promise<PageResult<SettleOutItemSelectorBo>> {
  return defHttp.get<PageResult<SettleOutItemSelectorBo>>(
    {
      url: selectorBaseUrl + '/settle/item/out',
      params,
    },
    {
      region,
    },
  );
}

export function loadSettleOutItem(ids: string[]): Promise<SettleOutItemSelectorBo[]> {
  return defHttp.post<SettleOutItemSelectorBo[]>(
    {
      url: selectorBaseUrl + '/settle/item/out/load',
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
export function query(params: QuerySettleOutItemVo): Promise<PageResult<QuerySettleOutItemBo>> {
  return defHttp.get<PageResult<QuerySettleOutItemBo>>(
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
export function get(id: string): Promise<GetSettleOutItemBo> {
  return defHttp.get<GetSettleOutItemBo>(
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
export function create(data: CreateSettleOutItemVo): Promise<void> {
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
export function update(data: UpdateSettleOutItemVo): Promise<void> {
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
 * 导出
 */
export function exportList(data: QuerySettleOutItemVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/export',
      data,
    },
    {
      responseType: ResponseEnum.BLOB,
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}
