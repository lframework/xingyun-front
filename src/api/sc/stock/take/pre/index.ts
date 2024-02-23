import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { PreTakeStockSheetSelectorVo } from '@/api/sc/stock/take/pre/model/preTakeStockSheetSelectorVo';
import { PreTakeStockSheetSelectorBo } from '@/api/sc/stock/take/pre/model/preTakeStockSheetSelectorBo';
import { QueryPreTakeStockSheetVo } from '@/api/sc/stock/take/pre/model/queryPreTakeStockSheetVo';
import { QueryPreTakeStockSheetBo } from '@/api/sc/stock/take/pre/model/queryPreTakeStockSheetBo';
import { GetPreTakeStockSheetBo } from '@/api/sc/stock/take/pre/model/getPreTakeStockSheetBo';
import { QueryPreTakeStockSheetProductBo } from '@/api/sc/stock/take/pre/model/queryPreTakeStockSheetProductBo';
import { CreatePreTakeStockSheetVo } from '@/api/sc/stock/take/pre/model/createPreTakeStockSheetVo';
import { UpdatePreTakeStockSheetVo } from '@/api/sc/stock/take/pre/model/updatePreTakeStockSheetVo';
import { PreTakeStockProductBo } from '@/api/sc/stock/take/pre/model/preTakeStockProductBo';
import { QueryPreTakeStockProductVo } from '@/api/sc/stock/take/pre/model/queryPreTakeStockProductVo';

const baseUrl = '/stock/take/pre';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: PreTakeStockSheetSelectorVo,
): Promise<PageResult<PreTakeStockSheetSelectorBo>> {
  return defHttp.get<PageResult<PreTakeStockSheetSelectorBo>>(
    {
      url: selectorBaseUrl + '/takestock/pre',
      params,
    },
    {
      region,
    },
  );
}

export function loadPreTakeStock(ids: string[]): Promise<PreTakeStockSheetSelectorBo[]> {
  return defHttp.post<PreTakeStockSheetSelectorBo[]>(
    {
      url: selectorBaseUrl + '/takestock/pre/load',
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
  params: QueryPreTakeStockSheetVo,
): Promise<PageResult<QueryPreTakeStockSheetBo>> {
  return defHttp.get<PageResult<QueryPreTakeStockSheetBo>>(
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
export function exportList(data: QueryPreTakeStockSheetVo): Promise<void> {
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
export function get(id: string): Promise<GetPreTakeStockSheetBo> {
  return defHttp.get<GetPreTakeStockSheetBo>(
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
 * 根据预先盘点单、盘点任务查询商品信息 */
export function getProducts(
  id: string,
  planId: string,
): Promise<QueryPreTakeStockSheetProductBo[]> {
  return defHttp.get<QueryPreTakeStockSheetProductBo[]>(
    {
      url: baseUrl + '/products',
      params: {
        id,
        planId,
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
export function create(data: CreatePreTakeStockSheetVo): Promise<void> {
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
export function update(data: UpdatePreTakeStockSheetVo): Promise<void> {
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
 * 根据关键字查询商品
 */
export function searchProducts(condition: string): Promise<PreTakeStockProductBo[]> {
  return defHttp.get<PreTakeStockProductBo[]>(
    {
      url: baseUrl + '/product/search',
      params: {
        condition,
      },
    },
    {
      region,
    },
  );
}

/**
 * 查询预先盘点单商品列表
 */
export function queryProductList(
  params: QueryPreTakeStockProductVo,
): Promise<PageResult<PreTakeStockProductBo>> {
  return defHttp.get<PageResult<PreTakeStockProductBo>>(
    {
      url: baseUrl + '/product/list',
      params,
    },
    {
      region,
    },
  );
}
