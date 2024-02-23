import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QuerySettleSheetVo } from '@/api/settle/sheet/model/querySettleSheetVo';
import { QuerySettleSheetBo } from '@/api/settle/sheet/model/querySettleSheetBo';
import { GetSettleSheetBo } from '@/api/settle/sheet/model/getSettleSheetBo';
import { CreateSettleSheetVo } from '@/api/settle/sheet/model/createSettleSheetVo';
import { UpdateSettleSheetVo } from '@/api/settle/sheet/model/updateSettleSheetVo';
import { ApprovePassSettleSheetVo } from '@/api/settle/sheet/model/approvePassSettleSheetVo';
import { BatchApprovePassSettleSheetVo } from '@/api/settle/sheet/model/batchApprovePassSettleSheetVo';
import { ApproveRefuseSettleSheetVo } from '@/api/settle/sheet/model/approveRefuseSettleSheetVo';
import { BatchApproveRefuseSettleSheetVo } from '@/api/settle/sheet/model/batchApproveRefuseSettleSheetVo';
import { SettleBizItemBo } from '@/api/settle/sheet/model/settleBizItemBo';
import { QueryUnSettleBizItemVo } from '@/api/settle/sheet/model/queryUnSettleBizItemVo';

const baseUrl = '/settle/sheet';
const region = 'cloud-api';

/**
 * 订单列表
 */
export function query(params: QuerySettleSheetVo): Promise<PageResult<QuerySettleSheetBo>> {
  return defHttp.get<PageResult<QuerySettleSheetBo>>(
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
export function exportList(data: QuerySettleSheetVo): Promise<void> {
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
export function get(id: string): Promise<GetSettleSheetBo> {
  return defHttp.get<GetSettleSheetBo>(
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
export function create(data: CreateSettleSheetVo): Promise<void> {
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
export function update(data: UpdateSettleSheetVo): Promise<void> {
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
export function approvePass(data: ApprovePassSettleSheetVo): Promise<void> {
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
export function batchApprovePass(data: BatchApprovePassSettleSheetVo): Promise<void> {
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
export function directApprovePass(data: CreateSettleSheetVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefuseSettleSheetVo): Promise<void> {
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
export function batchApproveRefuse(data: BatchApproveRefuseSettleSheetVo): Promise<void> {
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
 * 查询未结算的业务单据
 */
export function getUnSettleItems(params: QueryUnSettleBizItemVo): Promise<SettleBizItemBo[]> {
  return defHttp.get<SettleBizItemBo[]>(
    {
      url: baseUrl + '/unsettle-items',
      params,
    },
    {
      region,
    },
  );
}
