import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QueryLogisticsSheetVo } from '@/api/sc/logistics/sheet/model/queryLogisticsSheetVo';
import { QueryLogisticsSheetBo } from '@/api/sc/logistics/sheet/model/queryLogisticsSheetBo';
import { GetLogisticsSheetBo } from '@/api/sc/logistics/sheet/model/getLogisticsSheetBo';
import { QueryLogisticsSheetBizOrderVo } from '@/api/sc/logistics/sheet/model/queryLogisticsSheetBizOrderVo';
import { QueryLogisticsSheetBizOrderBo } from '@/api/sc/logistics/sheet/model/queryLogisticsSheetBizOrderBo';
import { LogisticsSheetCalcWeightOrVolumeVo } from '@/api/sc/logistics/sheet/model/logisticsSheetCalcWeightOrVolumeVo';
import { CreateLogisticsSheetVo } from '@/api/sc/logistics/sheet/model/createLogisticsSheetVo';
import { UpdateLogisticsSheetVo } from '@/api/sc/logistics/sheet/model/updateLogisticsSheetVo';
import { GetLogisticsSheetDeliveryBo } from '@/api/sc/logistics/sheet/model/getLogisticsSheetDeliveryBo';
import { DeliveryLogisticsSheetVo } from '@/api/sc/logistics/sheet/model/deliveryLogisticsSheetVo';

const baseUrl = '/logistics/sheet';
const region = 'cloud-api';

/**
 * 订单列表
 */
export function query(params: QueryLogisticsSheetVo): Promise<PageResult<QueryLogisticsSheetBo>> {
  return defHttp.get<PageResult<QueryLogisticsSheetBo>>(
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
 * 查询详情
 */
export function get(id: string): Promise<GetLogisticsSheetBo> {
  return defHttp.get<GetLogisticsSheetBo>(
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
 * 查询业务单据
 */
export function queryBizOrder(
  params: QueryLogisticsSheetBizOrderVo,
): Promise<PageResult<QueryLogisticsSheetBizOrderBo>> {
  return defHttp.get<PageResult<QueryLogisticsSheetBizOrderBo>>(
    {
      url: baseUrl + '/biz',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 计算重量
 */
export function calcWeight(data: LogisticsSheetCalcWeightOrVolumeVo): Promise<number> {
  return defHttp.post<number>(
    {
      url: baseUrl + '/calc/weight',
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.JSON,
    },
  );
}

/**
 * 计算体积
 */
export function calcVolume(data: LogisticsSheetCalcWeightOrVolumeVo): Promise<number> {
  return defHttp.post<number>(
    {
      url: baseUrl + '/calc/volume',
      data,
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
export function create(data: CreateLogisticsSheetVo): Promise<void> {
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
export function update(data: UpdateLogisticsSheetVo): Promise<void> {
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
 * 查询物流单发货信息
 */
export function queryDelivery(id: string): Promise<GetLogisticsSheetDeliveryBo> {
  return defHttp.get<GetLogisticsSheetDeliveryBo>(
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
 * 物流单发货
 */
export function delivery(data: DeliveryLogisticsSheetVo): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl + '/delivery',
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}

/**
 * 导出
 */
export function exportList(data: QueryLogisticsSheetVo): Promise<void> {
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
 * 下载导入模板
 */
export function downloadImportTemplate(): Promise<void> {
  return defHttp.get<void>(
    {
      url: baseUrl + '/import/template',
    },
    {
      responseType: ResponseEnum.BLOB,
      region,
    },
  );
}

/**
 * 导入
 */
export function importExcel(data: { id: string; file: Blob }): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/import',
      data,
    },
    {
      contentType: ContentTypeEnum.BLOB,
      region,
    },
  );
}

/**
 * 下载批量发货模板
 */
export function downloadDeliveryImportTemplate(): Promise<void> {
  return defHttp.get<void>(
    {
      url: baseUrl + '/import/template/delivery',
    },
    {
      responseType: ResponseEnum.BLOB,
      region,
    },
  );
}

/**
 * 批量发货
 */
export function deliveryImportExcel(data: { id: string; file: Blob }): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/import/delivery',
      data,
    },
    {
      contentType: ContentTypeEnum.BLOB,
      region,
    },
  );
}
