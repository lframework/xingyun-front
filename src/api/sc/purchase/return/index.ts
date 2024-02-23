import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { A4ExcelPortraitPrintBo } from '@/api/model/a4ExcelPortraitPrintBo';
import { PageResult } from '@/api/model/pageResult';
import { QueryPurchaseReturnVo } from '@/api/sc/purchase/return/model/queryPurchaseReturnVo';
import { QueryPurchaseReturnBo } from '@/api/sc/purchase/return/model/queryPurchaseReturnBo';
import { GetPurchaseReturnBo } from '@/api/sc/purchase/return/model/getPurchaseReturnBo';
import { CreatePurchaseReturnVo } from '@/api/sc/purchase/return/model/createPurchaseReturnVo';
import { UpdatePurchaseReturnVo } from '@/api/sc/purchase/return/model/updatePurchaseReturnVo';
import { ApprovePassPurchaseReturnVo } from '@/api/sc/purchase/return/model/approvePassPurchaseReturnVo';
import { BatchApprovePassPurchaseReturnVo } from '@/api/sc/purchase/return/model/batchApprovePassPurchaseReturnVo';
import { ApproveRefusePurchaseReturnVo } from '@/api/sc/purchase/return/model/approveRefusePurchaseReturnVo';
import { BatchApproveRefusePurchaseReturnVo } from '@/api/sc/purchase/return/model/batchApproveRefusePurchaseReturnVo';

const baseUrl = '/purchase/return';
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
export function query(params: QueryPurchaseReturnVo): Promise<PageResult<QueryPurchaseReturnBo>> {
  return defHttp.get<PageResult<QueryPurchaseReturnBo>>(
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
export function exportList(data: QueryPurchaseReturnVo): Promise<void> {
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
export function get(id: string): Promise<GetPurchaseReturnBo> {
  return defHttp.get<GetPurchaseReturnBo>(
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
 * 新增
 */
export function create(data: CreatePurchaseReturnVo): Promise<void> {
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
export function update(data: UpdatePurchaseReturnVo): Promise<void> {
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
export function approvePass(data: ApprovePassPurchaseReturnVo): Promise<void> {
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
export function batchApprovePass(data: BatchApprovePassPurchaseReturnVo): Promise<void> {
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
export function directApprovePass(data: CreatePurchaseReturnVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefusePurchaseReturnVo): Promise<void> {
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
export function batchApproveRefuse(data: BatchApproveRefusePurchaseReturnVo): Promise<void> {
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
