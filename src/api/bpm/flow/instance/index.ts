import { defHttp } from '@/utils/http/axios';
import { QueryBusinessFlowInstanceBo } from '@/api/bpm/flow/instance/model/queryBusinessFlowInstanceBo';

const baseUrl = '/flow/instance';
const region = 'cloud-api';

/**
 * 根据业务ID查询
 */
export function listBusiness(businessId: string): Promise<QueryBusinessFlowInstanceBo[]> {
  return defHttp.get<QueryBusinessFlowInstanceBo[]>(
    {
      url: baseUrl + '/list/business',
      params: {
        businessId,
      },
    },
    {
      region,
    },
  );
}

/**
 * 根据ID查询状态
 */
export function getStatus(id: string): Promise<string> {
  return defHttp.get<string>(
    {
      url: baseUrl + '/status',
      params: {
        id,
      },
    },
    {
      region,
    },
  );
}
