import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { A4ExcelPortraitPrintBo } from '@/api/model/a4ExcelPortraitPrintBo';
import { PageResult } from '@/api/model/pageResult';
import { GetPaymentDateBo } from '@/api/sc/purchase/receive/model/getPaymentDateBo';
import { QueryRetailOutSheetVo } from '@/api/sc/retail/out/model/queryRetailOutSheetVo';
import { QueryRetailOutSheetBo } from '@/api/sc/retail/out/model/queryRetailOutSheetBo';
import { GetRetailOutSheetBo } from '@/api/sc/retail/out/model/getRetailOutSheetBo';
import { RetailOutSheetWithReturnBo } from '@/api/sc/retail/out/model/retailOutSheetWithReturnBo';
import { QueryRetailOutSheetWithReturnVo } from '@/api/sc/retail/out/model/queryRetailOutSheetWithReturnVo';
import { QueryRetailOutSheetWithReturnBo } from '@/api/sc/retail/out/model/queryRetailOutSheetWithReturnBo';
import { CreateRetailOutSheetVo } from '@/api/sc/retail/out/model/createRetailOutSheetVo';
import { UpdateRetailOutSheetVo } from '@/api/sc/retail/out/model/updateRetailOutSheetVo';
import { ApprovePassRetailOutSheetVo } from '@/api/sc/retail/out/model/approvePassRetailOutSheetVo';
import { BatchApprovePassRetailOutSheetVo } from '@/api/sc/retail/out/model/batchApprovePassRetailOutSheetVo';
import { ApproveRefuseRetailOutSheetVo } from '@/api/sc/retail/out/model/approveRefuseRetailOutSheetVo';
import { BatchApproveRefuseRetailOutSheetVo } from '@/api/sc/retail/out/model/batchApproveRefuseRetailOutSheetVo';
import { RetailProductBo } from '@/api/sc/retail/out/model/retailProductBo';
import { QueryRetailProductVo } from '@/api/sc/retail/out/model/queryRetailProductVo';

const baseUrl = '/retail/out/sheet';
const region = 'cloud-api';

/**
 * 打印
 */
export function print(id: string): Promise<A4ExcelPortraitPrintBo> {
  return defHttp.get<A4ExcelPortraitPrintBo>(
    {
      url: baseUrl + '/print',
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
 * 订单列表
 */
export function query(params: QueryRetailOutSheetVo): Promise<PageResult<QueryRetailOutSheetBo>> {
  return defHttp.get<PageResult<QueryRetailOutSheetBo>>(
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
export function exportList(data: QueryRetailOutSheetVo): Promise<void> {
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
export function get(id: string): Promise<GetRetailOutSheetBo> {
  return defHttp.get<GetRetailOutSheetBo>(
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
 * 根据会员ID查询默认付款日期
 */
export function getPaymentDate(memberId: string): Promise<GetPaymentDateBo> {
  return defHttp.get<GetPaymentDateBo>(
    {
      url: baseUrl + '/paymentdate',
      params: {
        memberId,
      },
    },
    {
      region,
    },
  );
}

/**
 * 根据ID查询（零售退货业务）
 */
export function getWithReturn(id: string): Promise<RetailOutSheetWithReturnBo> {
  return defHttp.get<RetailOutSheetWithReturnBo>(
    {
      url: baseUrl + '/return',
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
 * 查询列表（零售退货业务）
 */
export function queryWithReturn(
  params: QueryRetailOutSheetWithReturnVo,
): Promise<PageResult<QueryRetailOutSheetWithReturnBo>> {
  return defHttp.get<PageResult<QueryRetailOutSheetWithReturnBo>>(
    {
      url: baseUrl + '/query/return',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 加载列表（零售退货业务）
 */
export function loadWithReturn(ids: string[]): Promise<QueryRetailOutSheetWithReturnBo[]> {
  return defHttp.post<QueryRetailOutSheetWithReturnBo[]>(
    {
      url: baseUrl + '/query/return/load',
      data: ids,
    },
    {
      region,
      contentType: ContentTypeEnum.JSON,
    },
  );
}

/**
 * 新增
 */
export function create(data: CreateRetailOutSheetVo): Promise<void> {
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
export function update(data: UpdateRetailOutSheetVo): Promise<void> {
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
export function approvePass(data: ApprovePassRetailOutSheetVo): Promise<void> {
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
export function batchApprovePass(data: BatchApprovePassRetailOutSheetVo): Promise<void> {
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
export function directApprovePass(data: CreateRetailOutSheetVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefuseRetailOutSheetVo): Promise<void> {
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
export function batchApproveRefuse(data: BatchApproveRefuseRetailOutSheetVo): Promise<void> {
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

/**
 * 根据关键字查询商品
 */
export function searchRetailProducts(
  scId: string,
  condition: string,
  isReturn: boolean,
): Promise<RetailProductBo[]> {
  return defHttp.get<RetailProductBo[]>(
    {
      url: baseUrl + '/product/search',
      params: {
        scId,
        condition,
        isReturn,
      },
    },
    {
      region,
    },
  );
}

/**
 * 查询可零售商品列表
 */
export function queryRetailProductList(
  params: QueryRetailProductVo,
): Promise<PageResult<RetailProductBo>> {
  return defHttp.get<PageResult<RetailProductBo>>(
    {
      url: baseUrl + '/product/list',
      params,
    },
    {
      region,
    },
  );
}
