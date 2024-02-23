import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { A4ExcelPortraitPrintBo } from '@/api/model/a4ExcelPortraitPrintBo';
import { QuerySaleOrderVo } from '@/api/sc/sale/order/model/querySaleOrderVo';
import { PageResult } from '@/api/model/pageResult';
import { QuerySaleOrderBo } from '@/api/sc/sale/order/model/querySaleOrderBo';
import { GetSaleOrderBo } from '@/api/sc/sale/order/model/getSaleOrderBo';
import { CreateSaleOrderVo } from '@/api/sc/sale/order/model/createSaleOrderVo';
import { UpdateSaleOrderVo } from '@/api/sc/sale/order/model/updateSaleOrderVo';
import { ApprovePassSaleOrderVo } from '@/api/sc/sale/order/model/approvePassSaleOrderVo';
import { BatchApprovePassSaleOrderVo } from '@/api/sc/sale/order/model/batchApprovePassSaleOrderVo';
import { ApproveRefuseSaleOrderVo } from '@/api/sc/sale/order/model/approveRefuseSaleOrderVo';
import { BatchApproveRefuseSaleOrderVo } from '@/api/sc/sale/order/model/batchApproveRefuseSaleOrderVo';
import { SaleProductBo } from '@/api/sc/sale/order/model/saleProductBo';
import { SaleOrderWithOutBo } from '@/api/sc/sale/order/model/saleOrderWithOutBo';
import { QuerySaleOrderWithOutBo } from '@/api/sc/sale/order/model/querySaleOrderWithOutBo';
import { QuerySaleOrderWithOutVo } from '@/api/sc/sale/order/model/querySaleOrderWithOutVo';
import { QuerySaleProductVo } from '@/api/sc/sale/order/model/querySaleProductVo';

const baseUrl = '/sale/order';
const region = 'cloud-api';

/**
 * 打印
 */
export function print(id: string): Promise<A4ExcelPortraitPrintBo> {
  return defHttp.get<A4ExcelPortraitPrintBo>(
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
export function query(params: QuerySaleOrderVo): Promise<PageResult<QuerySaleOrderBo>> {
  return defHttp.get<PageResult<QuerySaleOrderBo>>(
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
export function exportList(data: QuerySaleOrderVo): Promise<void> {
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
export function get(id: string): Promise<GetSaleOrderBo> {
  return defHttp.get<GetSaleOrderBo>(
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
 * 根据ID查询（出库业务）
 */
export function getWithOut(id: string): Promise<SaleOrderWithOutBo> {
  return defHttp.get<SaleOrderWithOutBo>(
    {
      url: baseUrl + '/out',
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
 * 查询列表（出库业务）
 */
export function queryWithOut(
  params: QuerySaleOrderWithOutVo,
): Promise<PageResult<QuerySaleOrderWithOutBo>> {
  return defHttp.get<PageResult<QuerySaleOrderWithOutBo>>(
    {
      url: baseUrl + '/query/out',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 加载列表（收货业务）
 */
export function loadWithOut(ids: string[]): Promise<QuerySaleOrderWithOutBo[]> {
  return defHttp.post<QuerySaleOrderWithOutBo[]>(
    {
      url: baseUrl + '/query/out/load',
      data: ids,
    },
    {
      region,
      contentType: ContentTypeEnum.JSON,
    },
  );
}

/**
 * 新增
 */
export function create(data: CreateSaleOrderVo): Promise<void> {
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
export function update(data: UpdateSaleOrderVo): Promise<void> {
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
export function approvePass(data: ApprovePassSaleOrderVo): Promise<void> {
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
export function batchApprovePass(data: BatchApprovePassSaleOrderVo): Promise<void> {
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
export function directApprovePass(data: CreateSaleOrderVo): Promise<void> {
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
export function approveRefuse(data: ApproveRefuseSaleOrderVo): Promise<void> {
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
export function batchApproveRefuse(data: BatchApproveRefuseSaleOrderVo): Promise<void> {
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
export function searchSaleProducts(scId: string, condition: string): Promise<SaleProductBo[]> {
  return defHttp.get<SaleProductBo[]>(
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
 * 查询可销售商品列表
 */
export function querySaleProductList(
  params: QuerySaleProductVo,
): Promise<PageResult<SaleProductBo>> {
  return defHttp.get<PageResult<SaleProductBo>>(
    {
      url: baseUrl + '/product/list',
      params,
    },
    {
      region,
    },
  );
}
