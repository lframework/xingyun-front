import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { A4ExcelPortraitPrintBo } from '@/api/model/a4ExcelPortraitPrintBo';
import { QueryPurchaseOrderVo } from '@/api/sc/purchase/order/model/queryPurchaseOrderVo';
import { PageResult } from '@/api/model/pageResult';
import { QueryPurchaseOrderBo } from '@/api/sc/purchase/order/model/queryPurchaseOrderBo';
import { GetPurchaseOrderBo } from '@/api/sc/purchase/order/model/getPurchaseOrderBo';
import { PurchaseOrderWithReceiveBo } from '@/api/sc/purchase/order/model/purchaseOrderWithReceiveBo';
import { QueryPurchaseOrderWithReceiveVo } from '@/api/sc/purchase/order/model/queryPurchaseOrderWithReceiveVo';
import { QueryPurchaseOrderWithReceiveBo } from '@/api/sc/purchase/order/model/queryPurchaseOrderWithReceiveBo';
import { CreatePurchaseOrderVo } from '@/api/sc/purchase/order/model/createPurchaseOrderVo';
import { UpdatePurchaseOrderVo } from '@/api/sc/purchase/order/model/updatePurchaseOrderVo';
import { ApprovePassPurchaseOrderVo } from '@/api/sc/purchase/order/model/approvePassPurchaseOrderVo';
import { BatchApprovePassPurchaseOrderVo } from '@/api/sc/purchase/order/model/batchApprovePassPurchaseOrderVo';
import { ApproveRefusePurchaseOrderVo } from '@/api/sc/purchase/order/model/approveRefusePurchaseOrderVo';
import { BatchApproveRefusePurchaseOrderVo } from '@/api/sc/purchase/order/model/batchApproveRefusePurchaseOrderVo';
import { PurchaseProductBo } from '@/api/sc/purchase/order/model/purchaseProductBo';
import { QueryPurchaseProductVo } from '@/api/sc/purchase/order/model/queryPurchaseProductVo';
import { PurchaseOrderSelectorVo } from '@/api/sc/purchase/order/model/purchaseOrderSelectorVo';
import { PurchaseOrderSelectorBo } from '@/api/sc/purchase/order/model/purchaseOrderSelectorBo';

const baseUrl = '/purchase/order';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: PurchaseOrderSelectorVo,
): Promise<PageResult<PurchaseOrderSelectorBo>> {
  return defHttp.get<PageResult<PurchaseOrderSelectorBo>>(
    {
      url: selectorBaseUrl + '/purchaseorder',
      params,
    },
    {
      region,
    },
  );
}

export function loadPurchaseOrder(ids: string[]): Promise<PurchaseOrderSelectorBo[]> {
  return defHttp.post<PurchaseOrderSelectorBo[]>(
    {
      url: selectorBaseUrl + '/purchaseorder/load',
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
export function query(params: QueryPurchaseOrderVo): Promise<PageResult<QueryPurchaseOrderBo>> {
  return defHttp.get<PageResult<QueryPurchaseOrderBo>>(
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
export function exportList(data: QueryPurchaseOrderVo): Promise<void> {
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
export function get(id: string): Promise<GetPurchaseOrderBo> {
  return defHttp.get<GetPurchaseOrderBo>(
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
 * 根据ID查询（收货业务）
 */
export function getWithReceive(id: string): Promise<PurchaseOrderWithReceiveBo> {
  return defHttp.get<PurchaseOrderWithReceiveBo>(
    {
      url: baseUrl + '/receive',
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
 * 查询列表（收货业务）
 */
export function queryWithReceive(
  params: QueryPurchaseOrderWithReceiveVo,
): Promise<PageResult<QueryPurchaseOrderWithReceiveBo>> {
  return defHttp.get<PageResult<QueryPurchaseOrderWithReceiveBo>>(
    {
      url: baseUrl + '/query/receive',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 加载列表（收货业务）
 */
export function loadWithReceive(ids: string[]): Promise<QueryPurchaseOrderWithReceiveBo[]> {
  return defHttp.post<QueryPurchaseOrderWithReceiveBo[]>(
    {
      url: baseUrl + '/query/receive/load',
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
export function create(data: CreatePurchaseOrderVo): Promise<void> {
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
export function update(data: UpdatePurchaseOrderVo): Promise<void> {
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
export function approvePass(data: ApprovePassPurchaseOrderVo): Promise<void> {
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
export function batchApprovePass(data: BatchApprovePassPurchaseOrderVo): Promise<void> {
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
export function directApprovePass(data: CreatePurchaseOrderVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefusePurchaseOrderVo): Promise<void> {
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
export function batchApproveRefuse(data: BatchApproveRefusePurchaseOrderVo): Promise<void> {
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

/**
 * 根据关键字查询商品
 */
export function searchPurchaseProducts(
  scId: string,
  condition: string,
): Promise<PurchaseProductBo[]> {
  return defHttp.get<PurchaseProductBo[]>(
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
 * 查询可采购商品列表
 */
export function queryPurchaseProductList(
  params: QueryPurchaseProductVo,
): Promise<PageResult<PurchaseProductBo>> {
  return defHttp.get<PageResult<PurchaseProductBo>>(
    {
      url: baseUrl + '/product/list',
      params,
    },
    {
      region,
    },
  );
}
