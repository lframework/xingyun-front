import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QueryTakeStockSheetBo } from '@/api/sc/stock/take/sheet/model/queryTakeStockSheetBo';
import { QueryTakeStockSheetVo } from '@/api/sc/stock/take/sheet/model/queryTakeStockSheetVo';
import { TakeStockSheetFullBo } from '@/api/sc/stock/take/sheet/model/takeStockSheetFullBo';
import { TakeStockSheetProductBo } from '@/api/sc/stock/take/sheet/model/takeStockSheetProductBo';
import { QueryTakeStockSheetProductVo } from '@/api/sc/stock/take/sheet/model/queryTakeStockSheetProductVo';
import { CreateTakeStockSheetVo } from '@/api/sc/stock/take/sheet/model/createTakeStockSheetVo';
import { UpdateTakeStockSheetVo } from '@/api/sc/stock/take/sheet/model/updateTakeStockSheetVo';
import { ApprovePassTakeStockSheetVo } from '@/api/sc/stock/take/sheet/model/approvePassTakeStockSheetVo';
import { ApproveRefuseTakeStockSheetVo } from '@/api/sc/stock/take/sheet/model/approveRefuseTakeStockSheetVo';

const baseUrl = '/stock/take/sheet';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(params: QueryTakeStockSheetVo): Promise<PageResult<QueryTakeStockSheetBo>> {
  return defHttp.get<PageResult<QueryTakeStockSheetBo>>(
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
export function exportList(data: QueryTakeStockSheetVo): Promise<void> {
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
export function getDetail(id: string): Promise<TakeStockSheetFullBo> {
  return defHttp.get<TakeStockSheetFullBo>(
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
  planId: string,
  condition: string,
): Promise<TakeStockSheetProductBo[]> {
  return defHttp.get<TakeStockSheetProductBo[]>(
    {
      url: baseUrl + '/product/search',
      params: {
        planId,
        condition,
      },
    },
    {
      region,
    },
  );
}

/**
 * 查询商品列表
 */
export function queryProductList(
  params: QueryTakeStockSheetProductVo,
): Promise<PageResult<TakeStockSheetProductBo>> {
  return defHttp.get<PageResult<TakeStockSheetProductBo>>(
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
export function create(data: CreateTakeStockSheetVo): Promise<void> {
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
export function update(data: UpdateTakeStockSheetVo): Promise<void> {
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
 * 直接审核通过
 */
export function directApprovePass(data: CreateTakeStockSheetVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/approve/direct',
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
export function approvePass(data: ApprovePassTakeStockSheetVo): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/approve/pass',
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}

/**
 * 批量审核通过
 */
export function batchApprovePass(data: ApprovePassTakeStockSheetVo): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/approve/pass',
      data,
    },
    {
      errorMessageMode: 'none',
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}

/**
 * 审核拒绝
 */
export function approveRefuse(data: ApproveRefuseTakeStockSheetVo): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/approve/refuse',
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}

/**
 * 批量审核拒绝
 */
export function batchApproveRefuse(data: ApproveRefuseTakeStockSheetVo): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/approve/refuse',
      data,
    },
    {
      errorMessageMode: 'none',
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}

/**
 * 取消审核
 */
export function cancelApprovePass(id: string): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/approve/cancel',
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
export function batchDelete(id: string): Promise<void> {
  return defHttp.delete<void>(
    {
      url: baseUrl,
      data: {
        id,
      },
    },
    {
      errorMessageMode: 'none',
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}
