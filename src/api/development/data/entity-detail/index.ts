import { defHttp } from '/@/utils/http/axios';
import { GenDataEntityDetailSelectorVo } from '@/api/development/data/entity-detail/model/genDataEntityDetailSelectorVo';
import { GenDataEntityDetailSelectorBo } from '@/api/development/data/entity-detail/model/genDataEntityDetailSelectorBo';

const selectorBaseUrl = '/selector/gen';
const region = 'cloud-api';

export function selector(
  params: GenDataEntityDetailSelectorVo,
): Promise<GenDataEntityDetailSelectorBo[]> {
  return defHttp.get<GenDataEntityDetailSelectorBo[]>(
    {
      url: selectorBaseUrl + '/data/entity/detail',
      params,
    },
    {
      region,
    },
  );
}
