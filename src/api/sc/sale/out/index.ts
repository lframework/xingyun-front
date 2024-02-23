import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { A4ExcelPortraitPrintBo } from '@/api/model/a4ExcelPortraitPrintBo';
import { PageResult } from '@/api/model/pageResult';
import { GetPaymentDateBo } from '@/api/sc/purchase/receive/model/getPaymentDateBo';
import { QuerySaleOutSheetBo } from '@/api/sc/sale/out/model/querySaleOutSheetBo';
import { QuerySaleOutSheetVo } from '@/api/sc/sale/out/model/querySaleOutSheetVo';
import { GetSaleOutSheetBo } from '@/api/sc/sale/out/model/getSaleOutSheetBo';
import { SaleOutSheetWithReturnBo } from '@/api/sc/sale/out/model/saleOutSheetWithReturnBo';
import { QuerySaleOutSheetWithReturnVo } from '@/api/sc/sale/out/model/querySaleOutSheetWithReturnVo';
import { QuerySaleOutSheetWithReturnBo } from '@/api/sc/sale/out/model/querySaleOutSheetWithReturnBo';
import { CreateSaleOutSheetVo } from '@/api/sc/sale/out/model/createSaleOutSheetVo';
import { UpdateSaleOutSheetVo } from '@/api/sc/sale/out/model/updateSaleOutSheetVo';
import { ApprovePassSaleOutSheetVo } from '@/api/sc/sale/out/model/approvePassSaleOutSheetVo';
import { BatchApprovePassSaleOutSheetVo } from '@/api/sc/sale/out/model/batchApprovePassSaleOutSheetVo';
import { ApproveRefuseSaleOutSheetVo } from '@/api/sc/sale/out/model/approveRefuseSaleOutSheetVo';
import { BatchApproveRefuseSaleOutSheetVo } from '@/api/sc/sale/out/model/batchApproveRefuseSaleOutSheetVo';

const baseUrl = '/sale/out/sheet';
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
export function query(params: QuerySaleOutSheetVo): Promise<PageResult<QuerySaleOutSheetBo>> {
  return defHttp.get<PageResult<QuerySaleOutSheetBo>>(
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
export function exportList(data: QuerySaleOutSheetVo): Promise<void> {
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
export function get(id: string): Promise<GetSaleOutSheetBo> {
  return defHttp.get<GetSaleOutSheetBo>(
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
 * 根据客户ID查询默认付款日期
 */
export function getPaymentDate(customerId: string): Promise<GetPaymentDateBo> {
  return defHttp.get<GetPaymentDateBo>(
    {
      url: baseUrl + '/paymentdate',
      params: {
        customerId,
      },
    },
    {
      region,
    },
  );
}

/**
 * 根据ID查询（销售退货业务）
 */
export function getWithReturn(id: string): Promise<SaleOutSheetWithReturnBo> {
  return defHttp.get<SaleOutSheetWithReturnBo>(
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
 * 查询列表（销售退货业务）
 */
export function queryWithReturn(
  params: QuerySaleOutSheetWithReturnVo,
): Promise<PageResult<QuerySaleOutSheetWithReturnBo>> {
  return defHttp.get<PageResult<QuerySaleOutSheetWithReturnBo>>(
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
 * 加载列表（销售退货业务）
 */
export function loadWithReturn(ids: string[]): Promise<QuerySaleOutSheetWithReturnBo[]> {
  return defHttp.post<QuerySaleOutSheetWithReturnBo[]>(
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
export function create(data: CreateSaleOutSheetVo): Promise<void> {
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
export function update(data: UpdateSaleOutSheetVo): Promise<void> {
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
export function approvePass(data: ApprovePassSaleOutSheetVo): Promise<void> {
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
export function batchApprovePass(data: BatchApprovePassSaleOutSheetVo): Promise<void> {
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
export function directApprovePass(data: CreateSaleOutSheetVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefuseSaleOutSheetVo): Promise<void> {
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
export function batchApproveRefuse(data: BatchApproveRefuseSaleOutSheetVo): Promise<void> {
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
