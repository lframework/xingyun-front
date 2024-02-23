import { defHttp } from '/@/utils/http/axios';
import { CitySelectorBo } from '@/api/common/city/model/citySelectorBo';

const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(): Promise<CitySelectorBo[]> {
  return defHttp.get<CitySelectorBo[]>(
    {
      url: selectorBaseUrl + '/city',
    },
    {
      region,
    },
  );
}
