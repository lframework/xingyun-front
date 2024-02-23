import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { ExcelImportBo } from '@/api/components/model/excelImportBo';
import { MapLocationBo } from '@/api/components/model/mapLocationBo';
import { OrderTimeLineBo } from '@/api/components/model/orderTimeLineBo';

const baseUrl = '/component';
const region = 'cloud-api';

/**
 * 查询导入Excel任务
 * @param id
 */
export function getExcelImportTask(id: string): Promise<ExcelImportBo> {
  return defHttp.get<ExcelImportBo>(
    {
      url: baseUrl + '/import/task',
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
 * 获取地图Key
 * @param address
 */
export function getMapKey(): Promise<string> {
  return defHttp.get<string>(
    {
      url: baseUrl + '/map/key',
    },
    {
      region,
    },
  );
}

/**
 * 根据地址查询经纬度
 * @param address
 */
export function getMapLocation(address: string): Promise<MapLocationBo> {
  return defHttp.get<MapLocationBo>(
    {
      url: baseUrl + '/map/location',
      params: {
        address,
      },
    },
    {
      region,
    },
  );
}

/**
 * 单据时间轴
 * @param orderId
 */
export function getOrderTimeLine(orderId: string): Promise<OrderTimeLineBo[]> {
  return defHttp.get<OrderTimeLineBo[]>(
    {
      url: baseUrl + '/timeline/order',
      params: {
        orderId,
      },
    },
    {
      region,
    },
  );
}

/**
 * 通用上传图片
 * @param file
 */
export function uploadImage(file: Blob): Promise<string> {
  return defHttp.post<string>(
    {
      url: baseUrl + '/upload/image',
      data: file,
    },
    {
      contentType: ContentTypeEnum.BLOB,
      region,
    },
  );
}

/**
 * 通用上传视频
 * @param file
 */
export function uploadVideo(file: Blob): Promise<string> {
  return defHttp.post<string>(
    {
      url: baseUrl + '/upload/video',
      data: file,
    },
    {
      contentType: ContentTypeEnum.BLOB,
      region,
    },
  );
}
