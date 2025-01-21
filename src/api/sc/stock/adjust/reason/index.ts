import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { StockAdjustReasonSelectorBo } from '@/api/sc/stock/adjust/reason/model/stockAdjustReasonSelectorBo';
import { StockAdjustReasonSelectorVo } from '@/api/sc/stock/adjust/reason/model/stockAdjustReasonSelectorVo';
import { QueryStockAdjustReasonBo } from '@/api/sc/stock/adjust/reason/model/queryStockAdjustReasonBo';
import { QueryStockAdjustReasonVo } from '@/api/sc/stock/adjust/reason/model/queryStockAdjustReasonVo';
import { GetStockAdjustReasonBo } from '@/api/sc/stock/adjust/reason/model/getStockAdjustReasonBo';
import { CreateStockAdjustReasonVo } from '@/api/sc/stock/adjust/reason/model/createStockAdjustReasonVo';
import { UpdateStockAdjustReasonVo } from '@/api/sc/stock/adjust/reason/model/updateStockAdjustReasonVo';

const baseUrl = '/stock/adjust/reason';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: StockAdjustReasonSelectorVo,
): Promise<PageResult<StockAdjustReasonSelectorBo>> {
  return defHttp.get<PageResult<StockAdjustReasonSelectorBo>>(
    {
      url: selectorBaseUrl + '/stock/adjust/reason',
      params,
    },
    {
      region,
    },
  );
}

export function loadStockAdjustReason(ids: string[]): Promise<StockAdjustReasonSelectorBo[]> {
  return defHttp.post<StockAdjustReasonSelectorBo[]>(
    {
      url: selectorBaseUrl + '/stock/adjust/reason/load',
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
  params: QueryStockAdjustReasonVo,
): Promise<PageResult<QueryStockAdjustReasonBo>> {
  return defHttp.get<PageResult<QueryStockAdjustReasonBo>>(
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
export function get(id: string): Promise<GetStockAdjustReasonBo> {
  return defHttp.get<GetStockAdjustReasonBo>(
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
 * 停用
 * @param id
 */
export function unable(id: string): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/unable',
      data: {
        id,
      },
    },
    {
      errorMessageMode: 'none',
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 启用
 * @param id
 */
export function enable(id: string): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/enable',
      data: {
        id,
      },
    },
    {
      errorMessageMode: 'none',
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 新增
 */
export function create(data: CreateStockAdjustReasonVo): Promise<void> {
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
export function update(data: UpdateStockAdjustReasonVo): Promise<void> {
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
