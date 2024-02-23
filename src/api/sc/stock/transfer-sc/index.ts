import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QueryScTransferOrderVo } from '@/api/sc/stock/transfer-sc/model/queryScTransferOrderVo';
import { QueryScTransferOrderBo } from '@/api/sc/stock/transfer-sc/model/queryScTransferOrderBo';
import { ScTransferOrderFullBo } from '@/api/sc/stock/transfer-sc/model/scTransferOrderFullBo';
import { ScTransferProductBo } from '@/api/sc/stock/transfer-sc/model/scTransferProductBo';
import { CreateScTransferOrderVo } from '@/api/sc/stock/transfer-sc/model/createScTransferOrderVo';
import { UpdateScTransferOrderVo } from '@/api/sc/stock/transfer-sc/model/updateScTransferOrderVo';
import { ApprovePassScTransferOrderVo } from '@/api/sc/stock/transfer-sc/model/approvePassScTransferOrderVo';
import { BatchApprovePassScTransferOrderVo } from '@/api/sc/stock/transfer-sc/model/batchApprovePassScTransferOrderVo';
import { ApproveRefuseScTransferOrderVo } from '@/api/sc/stock/transfer-sc/model/approveRefuseScTransferOrderVo';
import { BatchApproveRefuseScTransferOrderVo } from '@/api/sc/stock/transfer-sc/model/batchApproveRefuseScTransferOrderVo';
import { QueryScTransferProductVo } from '@/api/sc/stock/transfer-sc/model/queryScTransferProductVo';
import { ReceiveScTransferOrderVo } from '@/api/sc/stock/transfer-sc/model/receiveScTransferOrderVo';
import { QueryScTransferOrderDetailReceiveBo } from '@/api/sc/stock/transfer-sc/model/queryScTransferOrderDetailReceiveBo';
import { QueryScTransferOrderDetailReceiveVo } from '@/api/sc/stock/transfer-sc/model/queryScTransferOrderDetailReceiveVo';

const baseUrl = '/stock/transfer/sc';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(params: QueryScTransferOrderVo): Promise<PageResult<QueryScTransferOrderBo>> {
  return defHttp.get<PageResult<QueryScTransferOrderBo>>(
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
export function exportList(data: QueryScTransferOrderVo): Promise<void> {
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
export function get(id: string): Promise<ScTransferOrderFullBo> {
  return defHttp.get<ScTransferOrderFullBo>(
    {
      url: baseUrl + '/detail',
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
export function create(data: CreateScTransferOrderVo): Promise<void> {
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
export function update(data: UpdateScTransferOrderVo): Promise<void> {
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
export function approvePass(data: ApprovePassScTransferOrderVo): Promise<void> {
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
export function batchApprovePass(data: BatchApprovePassScTransferOrderVo): Promise<void> {
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
export function directApprovePass(data: CreateScTransferOrderVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefuseScTransferOrderVo): Promise<void> {
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
export function batchApproveRefuse(data: BatchApproveRefuseScTransferOrderVo): Promise<void> {
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
 * 根据关键字查询商品
 */
export function searchProducts(scId: string, condition: string): Promise<ScTransferProductBo[]> {
  return defHttp.get<ScTransferProductBo[]>(
    {
      url: baseUrl + '/product/search',
      params: {
        scId,
        condition,
      },
    },
    {
      region,
    },
  );
}

/**
 * 查询商品列表
 */
export function queryProductList(
  params: QueryScTransferProductVo,
): Promise<PageResult<ScTransferProductBo>> {
  return defHttp.get<PageResult<ScTransferProductBo>>(
    {
      url: baseUrl + '/product/list',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 收货
 */
export function receive(data: ReceiveScTransferOrderVo): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/receive',
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.JSON,
    },
  );
}

/**
 * 收货记录
 */
export function receiveDetail(
  params: QueryScTransferOrderDetailReceiveVo,
): Promise<PageResult<QueryScTransferOrderDetailReceiveBo>> {
  return defHttp.get<PageResult<QueryScTransferOrderDetailReceiveBo>>(
    {
      url: baseUrl + '/receive/detail',
      params,
    },
    {
      region,
    },
  );
}
