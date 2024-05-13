import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QueryStockCostAdjustSheetVo } from '@/api/sc/stock/adjust/cost/model/queryStockCostAdjustSheetVo';
import { QueryStockCostAdjustSheetBo } from '@/api/sc/stock/adjust/cost/model/queryStockCostAdjustSheetBo';
import { StockCostAdjustSheetFullBo } from '@/api/sc/stock/adjust/cost/model/stockCostAdjustSheetFullBo';
import { StockCostAdjustProductBo } from '@/api/sc/stock/adjust/cost/model/stockCostAdjustProductBo';
import { QueryStockCostAdjustProductVo } from '@/api/sc/stock/adjust/cost/model/queryStockCostAdjustProductVo';
import { CreateStockCostAdjustSheetVo } from '@/api/sc/stock/adjust/cost/model/createStockCostAdjustSheetVo';
import { UpdateStockCostAdjustSheetVo } from '@/api/sc/stock/adjust/cost/model/updateStockCostAdjustSheetVo';
import { ApprovePassStockCostAdjustSheetVo } from '@/api/sc/stock/adjust/cost/model/approvePassStockCostAdjustSheetVo';
import { BatchApprovePassStockCostAdjustSheetVo } from '@/api/sc/stock/adjust/cost/model/batchApprovePassStockCostAdjustSheetVo';
import { ApproveRefuseStockCostAdjustSheetVo } from '@/api/sc/stock/adjust/cost/model/approveRefuseStockCostAdjustSheetVo';
import { BatchApproveRefuseStockCostAdjustSheetVo } from '@/api/sc/stock/adjust/cost/model/batchApproveRefuseStockCostAdjustSheetVo';

const baseUrl = '/stock/adjust/cost';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(
  params: QueryStockCostAdjustSheetVo,
): Promise<PageResult<QueryStockCostAdjustSheetBo>> {
  return defHttp.get<PageResult<QueryStockCostAdjustSheetBo>>(
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
export function exportList(data: QueryStockCostAdjustSheetVo): Promise<void> {
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
export function getDetail(id: string): Promise<StockCostAdjustSheetFullBo> {
  return defHttp.get<StockCostAdjustSheetFullBo>(
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
 * 根据关键字查询商品列表
 */
export function searchProducts(
  scId: string,
  condition: string,
): Promise<StockCostAdjustProductBo[]> {
  return defHttp.get<StockCostAdjustProductBo[]>(
    {
      url: baseUrl + '/product/search',
      params: {
        scId,
        condition,
      },
    },
    {
      region,
    },
  );
}

/**
 * 根据关键字查询商品列表
 */
export function queryProductList(
  params: QueryStockCostAdjustProductVo,
): Promise<PageResult<StockCostAdjustProductBo>> {
  return defHttp.get<PageResult<StockCostAdjustProductBo>>(
    {
      url: baseUrl + '/product/list',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 新增
 */
export function create(data: CreateStockCostAdjustSheetVo): Promise<void> {
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
export function update(data: UpdateStockCostAdjustSheetVo): Promise<void> {
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
 * 审核通过
 */
export function approvePass(data: ApprovePassStockCostAdjustSheetVo): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/approve/pass',
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.JSON,
    },
  );
}

/**
 * 批量审核通过
 */
export function batchApprovePass(data: BatchApprovePassStockCostAdjustSheetVo): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/approve/pass/batch',
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.JSON,
    },
  );
}

/**
 * 直接审核通过
 */
export function directApprovePass(data: CreateStockCostAdjustSheetVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/approve/pass/direct',
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.JSON,
    },
  );
}

/**
 * 审核拒绝
 */
export function approveRefuse(data: ApproveRefuseStockCostAdjustSheetVo): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/approve/refuse',
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.JSON,
    },
  );
}

/**
 * 批量审核拒绝
 */
export function batchApproveRefuse(data: BatchApproveRefuseStockCostAdjustSheetVo): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/approve/refuse/batch',
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
