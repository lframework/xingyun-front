import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QuerySettleCheckSheetVo } from '@/api/settle/check/model/querySettleCheckSheetVo';
import { QuerySettleCheckSheetBo } from '@/api/settle/check/model/querySettleCheckSheetBo';
import { GetSettleCheckSheetBo } from '@/api/settle/check/model/getSettleCheckSheetBo';
import { CreateSettleCheckSheetVo } from '@/api/settle/check/model/createSettleCheckSheetVo';
import { UpdateSettleCheckSheetVo } from '@/api/settle/check/model/updateSettleCheckSheetVo';
import { ApprovePassSettleCheckSheetVo } from '@/api/settle/check/model/approvePassSettleCheckSheetVo';
import { BatchApprovePassSettleCheckSheetVo } from '@/api/settle/check/model/batchApprovePassSettleCheckSheetVo';
import { ApproveRefuseSettleCheckSheetVo } from '@/api/settle/check/model/approveRefuseSettleCheckSheetVo';
import { BatchApproveRefuseSettleCheckSheetVo } from '@/api/settle/check/model/batchApproveRefuseSettleCheckSheetVo';
import { SettleCheckBizItemBo } from '@/api/settle/check/model/settleCheckBizItemBo';
import { QueryUnCheckBizItemVo } from '@/api/settle/check/model/queryUnCheckBizItemVo';

const baseUrl = '/settle/checksheet';
const region = 'cloud-api';

/**
 * 订单列表
 */
export function query(
  params: QuerySettleCheckSheetVo,
): Promise<PageResult<QuerySettleCheckSheetBo>> {
  return defHttp.get<PageResult<QuerySettleCheckSheetBo>>(
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
export function exportList(data: QuerySettleCheckSheetVo): Promise<void> {
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
export function get(id: string): Promise<GetSettleCheckSheetBo> {
  return defHttp.get<GetSettleCheckSheetBo>(
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
export function create(data: CreateSettleCheckSheetVo): Promise<void> {
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
export function update(data: UpdateSettleCheckSheetVo): Promise<void> {
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
export function approvePass(data: ApprovePassSettleCheckSheetVo): Promise<void> {
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
export function batchApprovePass(data: BatchApprovePassSettleCheckSheetVo): Promise<void> {
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
export function directApprovePass(data: CreateSettleCheckSheetVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefuseSettleCheckSheetVo): Promise<void> {
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
export function batchApproveRefuse(data: BatchApproveRefuseSettleCheckSheetVo): Promise<void> {
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
export function getUnCheckItems(params: QueryUnCheckBizItemVo): Promise<SettleCheckBizItemBo[]> {
  return defHttp.get<SettleCheckBizItemBo[]>(
    {
      url: baseUrl + '/uncheck-items',
      params,
    },
    {
      region,
    },
  );
}
