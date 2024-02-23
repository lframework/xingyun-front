import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { GetTakeStockConfigBo } from '@/api/sc/stock/take/config/model/getTakeStockConfigBo';
import { UpdateTakeStockConfigVo } from '@/api/sc/stock/take/config/model/updateTakeStockConfigVo';

const baseUrl = '/stock/take/config';
const region = 'cloud-api';

/**
 * 查询详情
 */
export function get(): Promise<GetTakeStockConfigBo> {
  return defHttp.get<GetTakeStockConfigBo>(
    {
      url: baseUrl,
    },
    {
      region,
    },
  );
}

/**
 * 修改
 */
export function update(data: UpdateTakeStockConfigVo): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl,
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}
