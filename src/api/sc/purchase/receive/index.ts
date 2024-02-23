import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { A4ExcelPortraitPrintBo } from '@/api/model/a4ExcelPortraitPrintBo';
import { PageResult } from '@/api/model/pageResult';
import { ReceiveSheetSelectorVo } from '@/api/sc/purchase/receive/model/receiveSheetSelectorVo';
import { ReceiveSheetSelectorBo } from '@/api/sc/purchase/receive/model/receiveSheetSelectorBo';
import { QueryReceiveSheetBo } from '@/api/sc/purchase/receive/model/queryReceiveSheetBo';
import { QueryReceiveSheetVo } from '@/api/sc/purchase/receive/model/queryReceiveSheetVo';
import { GetReceiveSheetBo } from '@/api/sc/purchase/receive/model/getReceiveSheetBo';
import { GetPaymentDateBo } from '@/api/sc/purchase/receive/model/getPaymentDateBo';
import { ReceiveSheetWithReturnBo } from '@/api/sc/purchase/receive/model/receiveSheetWithReturnBo';
import { QueryReceiveSheetWithReturnVo } from '@/api/sc/purchase/receive/model/queryReceiveSheetWithReturnVo';
import { QueryReceiveSheetWithReturnBo } from '@/api/sc/purchase/receive/model/queryReceiveSheetWithReturnBo';
import { CreateReceiveSheetVo } from '@/api/sc/purchase/receive/model/createReceiveSheetVo';
import { UpdateReceiveSheetVo } from '@/api/sc/purchase/receive/model/updateReceiveSheetVo';
import { ApprovePassReceiveSheetVo } from '@/api/sc/purchase/receive/model/approvePassReceiveSheetVo';
import { BatchApprovePassReceiveSheetVo } from '@/api/sc/purchase/receive/model/batchApprovePassReceiveSheetVo';
import { ApproveRefuseReceiveSheetVo } from '@/api/sc/purchase/receive/model/approveRefuseReceiveSheetVo';
import { BatchApproveRefuseReceiveSheetVo } from '@/api/sc/purchase/receive/model/batchApproveRefuseReceiveSheetVo';

const baseUrl = '/purchase/receive/sheet';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: ReceiveSheetSelectorVo,
): Promise<PageResult<ReceiveSheetSelectorBo>> {
  return defHttp.get<PageResult<ReceiveSheetSelectorBo>>(
    {
      url: selectorBaseUrl + '/receivesheet',
      params,
    },
    {
      region,
    },
  );
}

export function loadReceiveSheet(ids: string[]): Promise<ReceiveSheetSelectorBo[]> {
  return defHttp.post<ReceiveSheetSelectorBo[]>(
    {
      url: selectorBaseUrl + '/receivesheet/load',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

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
export function query(params: QueryReceiveSheetVo): Promise<PageResult<QueryReceiveSheetBo>> {
  return defHttp.get<PageResult<QueryReceiveSheetBo>>(
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
export function exportList(data: QueryReceiveSheetVo): Promise<void> {
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
export function get(id: string): Promise<GetReceiveSheetBo> {
  return defHttp.get<GetReceiveSheetBo>(
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
 * 根据供应商ID查询默认付款日期
 */
export function getPaymentDate(supplierId: string): Promise<GetPaymentDateBo> {
  return defHttp.get<GetPaymentDateBo>(
    {
      url: baseUrl + '/paymentdate',
      params: {
        supplierId,
      },
    },
    {
      region,
    },
  );
}

/**
 * 根据ID查询（采购退货业务）
 */
export function getWithReturn(id: string): Promise<ReceiveSheetWithReturnBo> {
  return defHttp.get<ReceiveSheetWithReturnBo>(
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
 * 查询列表（采购退货业务）
 */
export function queryWithReturn(
  params: QueryReceiveSheetWithReturnVo,
): Promise<PageResult<QueryReceiveSheetWithReturnBo>> {
  return defHttp.get<PageResult<QueryReceiveSheetWithReturnBo>>(
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
 * 加载列表（采购退货业务）
 */
export function loadWithReturn(ids: string[]): Promise<QueryReceiveSheetWithReturnBo[]> {
  return defHttp.post<QueryReceiveSheetWithReturnBo[]>(
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
export function create(data: CreateReceiveSheetVo): Promise<void> {
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
export function update(data: UpdateReceiveSheetVo): Promise<void> {
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
export function approvePass(data: ApprovePassReceiveSheetVo): Promise<void> {
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
export function batchApprovePass(data: BatchApprovePassReceiveSheetVo): Promise<void> {
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
export function directApprovePass(data: CreateReceiveSheetVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefuseReceiveSheetVo): Promise<void> {
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
export function batchApproveRefuse(data: BatchApproveRefuseReceiveSheetVo): Promise<void> {
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
 * 下载导入模板
 */
export function downloadImportTemplate(): Promise<void> {
  return defHttp.get<void>(
    {
      url: baseUrl + '/import/template',
    },
    {
      responseType: ResponseEnum.BLOB,
      region,
    },
  );
}

/**
 * 导入
 */
export function importExcel(data: { id: string; file: Blob }): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/import',
      data,
    },
    {
      contentType: ContentTypeEnum.BLOB,
      region,
    },
  );
}

/**
 * 下载约定支付导入模板
 */
export function downloadImportPayTypeTemplate(): Promise<void> {
  return defHttp.get<void>(
    {
      url: baseUrl + '/import/template/paytype',
    },
    {
      responseType: ResponseEnum.BLOB,
      region,
    },
  );
}

/**
 * 导入约定支付
 */
export function importPayTypeExcel(data: { id: string; file: Blob }): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/import/paytype',
      data,
    },
    {
      contentType: ContentTypeEnum.BLOB,
      region,
    },
  );
}
