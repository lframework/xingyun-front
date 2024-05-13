import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QueryStockAdjustSheetVo } from '@/api/sc/stock/adjust/stock/model/queryStockAdjustSheetVo';
import { QueryStockAdjustSheetBo } from '@/api/sc/stock/adjust/stock/model/queryStockAdjustSheetBo';
import { StockAdjustSheetFullBo } from '@/api/sc/stock/adjust/stock/model/stockAdjustSheetFullBo';
import { StockAdjustProductBo } from '@/api/sc/stock/adjust/stock/model/stockAdjustProductBo';
import { QueryStockAdjustProductVo } from '@/api/sc/stock/adjust/stock/model/queryStockAdjustProductVo';
import { CreateStockAdjustSheetVo } from '@/api/sc/stock/adjust/stock/model/createStockAdjustSheetVo';
import { UpdateStockAdjustSheetVo } from '@/api/sc/stock/adjust/stock/model/updateStockAdjustSheetVo';
import { ApprovePassStockAdjustSheetVo } from '@/api/sc/stock/adjust/stock/model/approvePassStockAdjustSheetVo';
import { BatchApprovePassStockAdjustSheetVo } from '@/api/sc/stock/adjust/stock/model/batchApprovePassStockAdjustSheetVo';
import { ApproveRefuseStockAdjustSheetVo } from '@/api/sc/stock/adjust/stock/model/approveRefuseStockAdjustSheetVo';
import { BatchApproveRefuseStockAdjustSheetVo } from '@/api/sc/stock/adjust/stock/model/batchApproveRefuseStockAdjustSheetVo';

const baseUrl = '/stock/adjust';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(
  params: QueryStockAdjustSheetVo,
): Promise<PageResult<QueryStockAdjustSheetBo>> {
  return defHttp.get<PageResult<QueryStockAdjustSheetBo>>(
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
export function exportList(data: QueryStockAdjustSheetVo): Promise<void> {
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
export function getDetail(id: string): Promise<StockAdjustSheetFullBo> {
  return defHttp.get<StockAdjustSheetFullBo>(
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
export function searchProducts(scId: string, condition: string): Promise<StockAdjustProductBo[]> {
  return defHttp.get<StockAdjustProductBo[]>(
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
  params: QueryStockAdjustProductVo,
): Promise<PageResult<StockAdjustProductBo>> {
  return defHttp.get<PageResult<StockAdjustProductBo>>(
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
export function create(data: CreateStockAdjustSheetVo): Promise<void> {
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
export function update(data: UpdateStockAdjustSheetVo): Promise<void> {
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
export function approvePass(data: ApprovePassStockAdjustSheetVo): Promise<void> {
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
export function batchApprovePass(data: BatchApprovePassStockAdjustSheetVo): Promise<void> {
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
export function directApprovePass(data: CreateStockAdjustSheetVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefuseStockAdjustSheetVo): Promise<void> {
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
export function batchApproveRefuse(data: BatchApproveRefuseStockAdjustSheetVo): Promise<void> {
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
