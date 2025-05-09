import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QueryPurchaseReturnVo } from '@/api/sc/purchase/return/model/queryPurchaseReturnVo';
import { QueryPurchaseReturnBo } from '@/api/sc/purchase/return/model/queryPurchaseReturnBo';
import { GetPurchaseReturnBo } from '@/api/sc/purchase/return/model/getPurchaseReturnBo';
import { CreatePurchaseReturnVo } from '@/api/sc/purchase/return/model/createPurchaseReturnVo';
import { UpdatePurchaseReturnVo } from '@/api/sc/purchase/return/model/updatePurchaseReturnVo';
import { ApprovePassPurchaseReturnVo } from '@/api/sc/purchase/return/model/approvePassPurchaseReturnVo';
import { ApproveRefusePurchaseReturnVo } from '@/api/sc/purchase/return/model/approveRefusePurchaseReturnVo';
import { PrintPurchaseReturnBo } from '@/api/sc/purchase/return/model/printPurchaseReturnBo';

const baseUrl = '/purchase/return';
const region = 'cloud-api';

/**
 * 打印
 */
export function print(id: string): Promise<PrintPurchaseReturnBo> {
  return defHttp.get<PrintPurchaseReturnBo>(
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
export function batchApprovePass(data: ApprovePassPurchaseReturnVo): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/approve/pass',
      data,
    },
    {
      errorMessageMode: 'none',
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
export function batchApproveRefuse(data: ApproveRefusePurchaseReturnVo): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/approve/refuse',
      data,
    },
    {
      errorMessageMode: 'none',
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
