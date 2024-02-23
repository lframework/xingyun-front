import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { SettleInItemSelectorVo } from '@/api/settle/in-item/model/settleInItemSelectorVo';
import { SettleInItemSelectorBo } from '@/api/settle/in-item/model/settleInItemSelectorBo';
import { QuerySettleInItemBo } from '@/api/settle/in-item/model/querySettleInItemBo';
import { QuerySettleInItemVo } from '@/api/settle/in-item/model/querySettleInItemVo';
import { GetSettleInItemBo } from '@/api/settle/in-item/model/getSettleInItemBo';
import { CreateSettleInItemVo } from '@/api/settle/in-item/model/createSettleInItemVo';
import { UpdateSettleInItemVo } from '@/api/settle/in-item/model/updateSettleInItemVo';

const baseUrl = '/settle/item/in';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: SettleInItemSelectorVo,
): Promise<PageResult<SettleInItemSelectorBo>> {
  return defHttp.get<PageResult<SettleInItemSelectorBo>>(
    {
      url: selectorBaseUrl + '/settle/item/in',
      params,
    },
    {
      region,
    },
  );
}

export function loadSettleInItem(ids: string[]): Promise<SettleInItemSelectorBo[]> {
  return defHttp.post<SettleInItemSelectorBo[]>(
    {
      url: selectorBaseUrl + '/settle/item/in/load',
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
export function query(params: QuerySettleInItemVo): Promise<PageResult<QuerySettleInItemBo>> {
  return defHttp.get<PageResult<QuerySettleInItemBo>>(
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
export function get(id: string): Promise<GetSettleInItemBo> {
  return defHttp.get<GetSettleInItemBo>(
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
export function create(data: CreateSettleInItemVo): Promise<void> {
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
export function update(data: UpdateSettleInItemVo): Promise<void> {
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
export function exportList(data: QuerySettleInItemVo): Promise<void> {
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
