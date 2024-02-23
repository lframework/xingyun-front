import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { GetPurchaseConfigBo } from '@/api/sc/purchase/config/model/getPurchaseConfigBo';
import { UpdatePurchaseConfigVo } from '@/api/sc/purchase/config/model/updatePurchaseConfigVo';

const baseUrl = '/purchase/config';
const region = 'cloud-api';

/**
 * 查询详情
 */
export function get(): Promise<GetPurchaseConfigBo> {
  return defHttp.get<GetPurchaseConfigBo>(
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
export function update(data: UpdatePurchaseConfigVo): Promise<void> {
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
