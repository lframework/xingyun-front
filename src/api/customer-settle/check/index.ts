import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QueryCustomerSettleCheckSheetVo } from '@/api/customer-settle/check/model/queryCustomerSettleCheckSheetVo';
import { QueryCustomerSettleCheckSheetBo } from '@/api/customer-settle/check/model/queryCustomerSettleCheckSheetBo';
import { GetCustomerSettleCheckSheetBo } from '@/api/customer-settle/check/model/getCustomerSettleCheckSheetBo';
import { CreateCustomerSettleCheckSheetVo } from '@/api/customer-settle/check/model/createCustomerSettleCheckSheetVo';
import { UpdateCustomerSettleCheckSheetVo } from '@/api/customer-settle/check/model/updateCustomerSettleCheckSheetVo';
import { ApprovePassCustomerSettleCheckSheetVo } from '@/api/customer-settle/check/model/approvePassCustomerSettleCheckSheetVo';
import { BatchApprovePassCustomerSettleCheckSheetVo } from '@/api/customer-settle/check/model/batchApprovePassCustomerSettleCheckSheetVo';
import { ApproveRefuseCustomerSettleCheckSheetVo } from '@/api/customer-settle/check/model/approveRefuseCustomerSettleCheckSheetVo';
import { BatchApproveRefuseCustomerSettleCheckSheetVo } from '@/api/customer-settle/check/model/batchApproveRefuseCustomerSettleCheckSheetVo';
import { CustomerSettleCheckBizItemBo } from '@/api/customer-settle/check/model/customerSettleCheckBizItemBo';
import { QueryCustomerUnCheckBizItemVo } from '@/api/customer-settle/check/model/queryCustomerUnCheckBizItemVo';

const baseUrl = '/customer/settle/checksheet';
const region = 'cloud-api';

/**
 * 订单列表
 */
export function query(
  params: QueryCustomerSettleCheckSheetVo,
): Promise<PageResult<QueryCustomerSettleCheckSheetBo>> {
  return defHttp.get<PageResult<QueryCustomerSettleCheckSheetBo>>(
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
export function exportList(data: QueryCustomerSettleCheckSheetVo): Promise<void> {
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
export function get(id: string): Promise<GetCustomerSettleCheckSheetBo> {
  return defHttp.get<GetCustomerSettleCheckSheetBo>(
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
export function create(data: CreateCustomerSettleCheckSheetVo): Promise<void> {
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
export function update(data: UpdateCustomerSettleCheckSheetVo): Promise<void> {
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
export function approvePass(data: ApprovePassCustomerSettleCheckSheetVo): Promise<void> {
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
export function batchApprovePass(data: BatchApprovePassCustomerSettleCheckSheetVo): Promise<void> {
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
export function directApprovePass(data: CreateCustomerSettleCheckSheetVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefuseCustomerSettleCheckSheetVo): Promise<void> {
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
export function batchApproveRefuse(data: BatchApproveRefuseCustomerSettleCheckSheetVo): Promise<void> {
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
 * 查询未对账的业务单据
 */
export function getUnCheckItems(params: QueryCustomerUnCheckBizItemVo): Promise<CustomerSettleCheckBizItemBo[]> {
  return defHttp.get<CustomerSettleCheckBizItemBo[]>(
    {
      url: baseUrl + '/uncheck-items',
      params,
    },
    {
      region,
    },
  );
}
