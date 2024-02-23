import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { GetRetailConfigBo } from '@/api/sc/retail/config/model/getRetailConfigBo';
import { UpdateRetailConfigVo } from '@/api/sc/retail/config/model/updateRetailConfigVo';

const baseUrl = '/retail/config';
const region = 'cloud-api';

/**
 * 查询详情
 */
export function get(): Promise<GetRetailConfigBo> {
  return defHttp.get<GetRetailConfigBo>(
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
export function update(data: UpdateRetailConfigVo): Promise<void> {
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
