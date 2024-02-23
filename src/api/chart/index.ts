import { defHttp } from '/@/utils/http/axios';

const baseUrl = '/chart';
const region = 'cloud-api';

export function orderChart(): Promise<Map<string, any>> {
  return defHttp.get<Map<string, any>>(
    {
      url: baseUrl + '/order',
    },
    {
      region,
    },
  );
}
