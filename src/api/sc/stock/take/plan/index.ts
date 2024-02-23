import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { TakeStockPlanSelectorBo } from '@/api/sc/stock/take/plan/model/takeStockPlanSelectorBo';
import { TakeStockPlanSelectorVo } from '@/api/sc/stock/take/plan/model/takeStockPlanSelectorVo';
import { QueryTakeStockPlanVo } from '@/api/sc/stock/take/plan/model/queryTakeStockPlanVo';
import { QueryTakeStockPlanBo } from '@/api/sc/stock/take/plan/model/queryTakeStockPlanBo';
import { GetTakeStockPlanBo } from '@/api/sc/stock/take/plan/model/getTakeStockPlanBo';
import { TakeStockPlanFullBo } from '@/api/sc/stock/take/plan/model/takeStockPlanFullBo';
import { QueryTakeStockPlanProductBo } from '@/api/sc/stock/take/plan/model/queryTakeStockPlanProductBo';
import { CreateTakeStockPlanVo } from '@/api/sc/stock/take/plan/model/createTakeStockPlanVo';
import { UpdateTakeStockPlanVo } from '@/api/sc/stock/take/plan/model/updateTakeStockPlanVo';
import { HandleTakeStockPlanVo } from '@/api/sc/stock/take/plan/model/handleTakeStockPlanVo';
import { CancelTakeStockPlanVo } from '@/api/sc/stock/take/plan/model/cancelTakeStockPlanVo';

const baseUrl = '/stock/take/plan';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: TakeStockPlanSelectorVo,
): Promise<PageResult<TakeStockPlanSelectorBo>> {
  return defHttp.get<PageResult<TakeStockPlanSelectorBo>>(
    {
      url: selectorBaseUrl + '/takestock/plan',
      params,
    },
    {
      region,
    },
  );
}

export function loadTakeStockPlan(ids: string[]): Promise<TakeStockPlanSelectorBo[]> {
  return defHttp.post<TakeStockPlanSelectorBo[]>(
    {
      url: selectorBaseUrl + '/takestock/plan/load',
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
export function query(params: QueryTakeStockPlanVo): Promise<PageResult<QueryTakeStockPlanBo>> {
  return defHttp.get<PageResult<QueryTakeStockPlanBo>>(
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
 * 导出
 */
export function exportList(data: QueryTakeStockPlanVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/export',
      data,
    },
    {
      region,
      responseType: ResponseEnum.BLOB,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}

/**
 * 查询详情
 */
export function get(id: string): Promise<GetTakeStockPlanBo> {
  return defHttp.get<GetTakeStockPlanBo>(
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
 * 查询详情
 */
export function getDetail(id: string): Promise<TakeStockPlanFullBo> {
  return defHttp.get<TakeStockPlanFullBo>(
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
 * 根据预先盘点单、盘点任务查询商品信息
 */
export function getProducts(id: string): Promise<QueryTakeStockPlanProductBo[]> {
  return defHttp.get<QueryTakeStockPlanProductBo[]>(
    {
      url: baseUrl + '/products',
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
export function create(data: CreateTakeStockPlanVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl,
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.JSON,
    },
  );
}

/**
 * 修改
 */
export function update(data: UpdateTakeStockPlanVo): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl,
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.JSON,
    },
  );
}

/**
 * 差异生成
 */
export function createDiff(id: string): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/diff',
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
 * 差异处理
 */
export function handleDiff(data: HandleTakeStockPlanVo): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/handle',
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.JSON,
    },
  );
}

/**
 * 作废
 */
export function cancel(data: CancelTakeStockPlanVo): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/cancel',
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
