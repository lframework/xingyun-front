import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QueryCustomerSettleFeeSheetVo } from '@/api/customer-settle/fee/model/queryCustomerSettleFeeSheetVo';
import { QueryCustomerSettleFeeSheetBo } from '@/api/customer-settle/fee/model/queryCustomerSettleFeeSheetBo';
import { GetCustomerSettleFeeSheetBo } from '@/api/customer-settle/fee/model/getCustomerSettleFeeSheetBo';
import { CreateCustomerSettleFeeSheetVo } from '@/api/customer-settle/fee/model/createCustomerSettleFeeSheetVo';
import { UpdateCustomerSettleFeeSheetVo } from '@/api/customer-settle/fee/model/updateCustomerSettleFeeSheetVo';
import { ApprovePassCustomerSettleFeeSheetVo } from '@/api/customer-settle/fee/model/approvePassCustomerSettleFeeSheetVo';
import { BatchApprovePassCustomerSettleFeeSheetVo } from '@/api/customer-settle/fee/model/batchApprovePassCustomerSettleFeeSheetVo';
import { ApproveRefuseCustomerSettleFeeSheetVo } from '@/api/customer-settle/fee/model/approveRefuseCustomerSettleFeeSheetVo';
import { BatchApproveRefuseCustomerSettleFeeSheetVo } from '@/api/customer-settle/fee/model/batchApproveRefuseCustomerSettleFeeSheetVo';

const baseUrl = '/customer/settle/feesheet';
const region = 'cloud-api';

/**
 * 订单列表
 */
export function query(
  params: QueryCustomerSettleFeeSheetVo,
): Promise<PageResult<QueryCustomerSettleFeeSheetBo>> {
  return defHttp.get<PageResult<QueryCustomerSettleFeeSheetBo>>(
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
export function exportList(data: QueryCustomerSettleFeeSheetVo): Promise<void> {
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
export function get(id: string): Promise<GetCustomerSettleFeeSheetBo> {
  return defHttp.get<GetCustomerSettleFeeSheetBo>(
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
export function create(data: CreateCustomerSettleFeeSheetVo): Promise<void> {
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
export function update(data: UpdateCustomerSettleFeeSheetVo): Promise<void> {
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
export function approvePass(data: ApprovePassCustomerSettleFeeSheetVo): Promise<void> {
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
export function batchApprovePass(data: BatchApprovePassCustomerSettleFeeSheetVo): Promise<void> {
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
export function directApprovePass(data: CreateCustomerSettleFeeSheetVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefuseCustomerSettleFeeSheetVo): Promise<void> {
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
  data: BatchApproveRefuseCustomerSettleFeeSheetVo,
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
