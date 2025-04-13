import { defHttp } from '/@/utils/http/axios';

const baseUrl = '/download/security';
const region = 'cloud-api';

/**
 * 下载文件（获取签名URL）
 * @param id
 */
export function getSecurityDownloadUrl(id: string): Promise<string> {
  return defHttp.get<string>(
    {
      url: baseUrl + '/url',
      params: {
        id,
      },
    },
    {
      region,
    },
  );
}
