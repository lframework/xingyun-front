import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QueryCustomerSettleSheetVo } from '@/api/customer-settle/sheet/model/queryCustomerSettleSheetVo';
import { QueryCustomerSettleSheetBo } from '@/api/customer-settle/sheet/model/queryCustomerSettleSheetBo';
import { GetCustomerSettleSheetBo } from '@/api/customer-settle/sheet/model/getCustomerSettleSheetBo';
import { CreateCustomerSettleSheetVo } from '@/api/customer-settle/sheet/model/createCustomerSettleSheetVo';
import { UpdateCustomerSettleSheetVo } from '@/api/customer-settle/sheet/model/updateCustomerSettleSheetVo';
import { ApprovePassCustomerSettleSheetVo } from '@/api/customer-settle/sheet/model/approvePassCustomerSettleSheetVo';
import { ApproveRefuseCustomerSettleSheetVo } from '@/api/customer-settle/sheet/model/approveRefuseCustomerSettleSheetVo';
import { CustomerSettleBizItemBo } from '@/api/customer-settle/sheet/model/customerSettleBizItemBo';
import { QueryCustomerUnSettleBizItemVo } from '@/api/customer-settle/sheet/model/queryCustomerUnSettleBizItemVo';

const baseUrl = '/customer/settle/sheet';
const region = 'cloud-api';

/**
 * 订单列表
 */
export function query(
  params: QueryCustomerSettleSheetVo,
): Promise<PageResult<QueryCustomerSettleSheetBo>> {
  return defHttp.get<PageResult<QueryCustomerSettleSheetBo>>(
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
export function exportList(data: QueryCustomerSettleSheetVo): Promise<void> {
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
export function get(id: string): Promise<GetCustomerSettleSheetBo> {
  return defHttp.get<GetCustomerSettleSheetBo>(
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
export function create(data: CreateCustomerSettleSheetVo): Promise<void> {
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
export function update(data: UpdateCustomerSettleSheetVo): Promise<void> {
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
export function approvePass(data: ApprovePassCustomerSettleSheetVo): Promise<void> {
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
export function batchApprovePass(data: ApprovePassCustomerSettleSheetVo): Promise<void> {
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
export function directApprovePass(data: CreateCustomerSettleSheetVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefuseCustomerSettleSheetVo): Promise<void> {
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
export function batchApproveRefuse(data: ApproveRefuseCustomerSettleSheetVo): Promise<void> {
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

/**
 * 查询未结算的业务单据
 */
export function getUnSettleItems(
  params: QueryCustomerUnSettleBizItemVo,
): Promise<CustomerSettleBizItemBo[]> {
  return defHttp.get<CustomerSettleBizItemBo[]>(
    {
      url: baseUrl + '/unsettle-items',
      params,
    },
    {
      region,
    },
  );
}
