import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QueryRetailReturnBo } from '@/api/sc/retail/return/model/queryRetailReturnBo';
import { QueryRetailReturnVo } from '@/api/sc/retail/return/model/queryRetailReturnVo';
import { GetRetailReturnBo } from '@/api/sc/retail/return/model/getRetailReturnBo';
import { CreateRetailReturnVo } from '@/api/sc/retail/return/model/createRetailReturnVo';
import { UpdateRetailReturnVo } from '@/api/sc/retail/return/model/updateRetailReturnVo';
import { ApprovePassRetailReturnVo } from '@/api/sc/retail/return/model/approvePassRetailReturnVo';
import { ApproveRefuseRetailReturnVo } from '@/api/sc/retail/return/model/approveRefuseRetailReturnVo';
import { PrintRetailReturnBo } from '@/api/sc/retail/return/model/printRetailReturnBo';

const baseUrl = '/retail/return';
const region = 'cloud-api';

/**
 * 打印
 */
export function print(id: string): Promise<PrintRetailReturnBo> {
  return defHttp.get<PrintRetailReturnBo>(
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
export function query(params: QueryRetailReturnVo): Promise<PageResult<QueryRetailReturnBo>> {
  return defHttp.get<PageResult<QueryRetailReturnBo>>(
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
export function exportList(data: QueryRetailReturnVo): Promise<void> {
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
export function get(id: string): Promise<GetRetailReturnBo> {
  return defHttp.get<GetRetailReturnBo>(
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
export function create(data: CreateRetailReturnVo): Promise<void> {
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
export function update(data: UpdateRetailReturnVo): Promise<void> {
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
export function approvePass(data: ApprovePassRetailReturnVo): Promise<void> {
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
export function batchApprovePass(data: ApprovePassRetailReturnVo): Promise<void> {
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
export function directApprovePass(data: CreateRetailReturnVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefuseRetailReturnVo): Promise<void> {
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
export function batchApproveRefuse(data: ApproveRefuseRetailReturnVo): Promise<void> {
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
