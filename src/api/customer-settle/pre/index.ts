import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QueryCustomerSettlePreSheetVo } from '@/api/customer-settle/pre/model/queryCustomerSettlePreSheetVo';
import { QueryCustomerSettlePreSheetBo } from '@/api/customer-settle/pre/model/queryCustomerSettlePreSheetBo';
import { GetCustomerSettlePreSheetBo } from '@/api/customer-settle/pre/model/getCustomerSettlePreSheetBo';
import { CreateCustomerSettlePreSheetVo } from '@/api/customer-settle/pre/model/createCustomerSettlePreSheetVo';
import { UpdateCustomerSettlePreSheetVo } from '@/api/customer-settle/pre/model/updateCustomerSettlePreSheetVo';
import { ApprovePassCustomerSettlePreSheetVo } from '@/api/customer-settle/pre/model/approvePassCustomerSettlePreSheetVo';
import { BatchApprovePassCustomerSettlePreSheetVo } from '@/api/customer-settle/pre/model/batchApprovePassCustomerSettlePreSheetVo';
import { ApproveRefuseCustomerSettlePreSheetVo } from '@/api/customer-settle/pre/model/approveRefuseCustomerSettlePreSheetVo';
import { BatchApproveRefuseCustomerSettlePreSheetVo } from '@/api/customer-settle/pre/model/batchApproveRefuseCustomerSettlePreSheetVo';

const baseUrl = '/customer/settle/presheet';
const region = 'cloud-api';

/**
 * 订单列表
 */
export function query(
  params: QueryCustomerSettlePreSheetVo,
): Promise<PageResult<QueryCustomerSettlePreSheetBo>> {
  return defHttp.get<PageResult<QueryCustomerSettlePreSheetBo>>(
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
export function exportList(data: QueryCustomerSettlePreSheetVo): Promise<void> {
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
export function get(id: string): Promise<GetCustomerSettlePreSheetBo> {
  return defHttp.get<GetCustomerSettlePreSheetBo>(
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
export function create(data: CreateCustomerSettlePreSheetVo): Promise<void> {
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
export function update(data: UpdateCustomerSettlePreSheetVo): Promise<void> {
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
export function approvePass(data: ApprovePassCustomerSettlePreSheetVo): Promise<void> {
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
export function batchApprovePass(data: BatchApprovePassCustomerSettlePreSheetVo): Promise<void> {
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
export function directApprovePass(data: CreateCustomerSettlePreSheetVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefuseCustomerSettlePreSheetVo): Promise<void> {
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
export function batchApproveRefuse(
  data: BatchApproveRefuseCustomerSettlePreSheetVo,
): Promise<void> {
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
