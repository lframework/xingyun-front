import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { GetSaleConfigBo } from '@/api/sc/sale/config/model/getSaleConfigBo';
import { UpdateSaleConfigVo } from '@/api/sc/sale/config/model/updateSaleConfigVo';

const baseUrl = '/sale/config';
const region = 'cloud-api';

/**
 * 查询详情
 */
export function get(): Promise<GetSaleConfigBo> {
  return defHttp.get<GetSaleConfigBo>(
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
export function update(data: UpdateSaleConfigVo): Promise<void> {
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
