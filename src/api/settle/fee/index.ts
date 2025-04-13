import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QuerySettleFeeSheetVo } from '@/api/settle/fee/model/querySettleFeeSheetVo';
import { QuerySettleFeeSheetBo } from '@/api/settle/fee/model/querySettleFeeSheetBo';
import { GetSettleFeeSheetBo } from '@/api/settle/fee/model/getSettleFeeSheetBo';
import { CreateSettleFeeSheetVo } from '@/api/settle/fee/model/createSettleFeeSheetVo';
import { UpdateSettleFeeSheetVo } from '@/api/settle/fee/model/updateSettleFeeSheetVo';
import { ApprovePassSettleFeeSheetVo } from '@/api/settle/fee/model/approvePassSettleFeeSheetVo';
import { ApproveRefuseSettleFeeSheetVo } from '@/api/settle/fee/model/approveRefuseSettleFeeSheetVo';

const baseUrl = '/settle/feesheet';
const region = 'cloud-api';

/**
 * 订单列表
 */
export function query(params: QuerySettleFeeSheetVo): Promise<PageResult<QuerySettleFeeSheetBo>> {
  return defHttp.get<PageResult<QuerySettleFeeSheetBo>>(
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
export function exportList(data: QuerySettleFeeSheetVo): Promise<void> {
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
export function get(id: string): Promise<GetSettleFeeSheetBo> {
  return defHttp.get<GetSettleFeeSheetBo>(
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
export function create(data: CreateSettleFeeSheetVo): Promise<void> {
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
export function update(data: UpdateSettleFeeSheetVo): Promise<void> {
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
export function approvePass(data: ApprovePassSettleFeeSheetVo): Promise<void> {
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
export function batchApprovePass(data: ApprovePassSettleFeeSheetVo): Promise<void> {
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
export function directApprovePass(data: CreateSettleFeeSheetVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefuseSettleFeeSheetVo): Promise<void> {
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
export function batchApproveRefuse(data: ApproveRefuseSettleFeeSheetVo): Promise<void> {
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
