import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { PayTypeSelectorVo } from '@/api/base-data/pay-type/model/payTypeSelectorVo';
import { PayTypeSelectorBo } from '@/api/base-data/pay-type/model/payTypeSelectorBo';
import { UpdatePayTypeVo } from '@/api/base-data/pay-type/model/updatePayTypeVo';
import { CreatePayTypeVo } from '@/api/base-data/pay-type/model/createPayTypeVo';
import { GetPayTypeBo } from '@/api/base-data/pay-type/model/getPayTypeBo';
import { QueryPayTypeVo } from '@/api/base-data/pay-type/model/queryPayTypeVo';
import { QueryPayTypeBo } from '@/api/base-data/pay-type/model/queryPayTypeBo';
import { OrderPayTypeBo } from '@/api/sc/pay-type/model/orderPayTypeBo';

const baseUrl = '/basedata/paytype';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(params: PayTypeSelectorVo): Promise<PageResult<PayTypeSelectorBo>> {
  return defHttp.get<PageResult<PayTypeSelectorBo>>(
    {
      url: selectorBaseUrl + '/paytype',
      params,
    },
    {
      region,
    },
  );
}

export function loadPayType(ids: string[]): Promise<PayTypeSelectorBo[]> {
  return defHttp.post<PayTypeSelectorBo[]>(
    {
      url: selectorBaseUrl + '/paytype/load',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

export function getOrderPayType(orderId: string): Promise<OrderPayTypeBo[]> {
  return defHttp.get<OrderPayTypeBo[]>(
    {
      url: selectorBaseUrl + '/paytype/order',
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
 * 查询列表
 */
export function query(params: QueryPayTypeVo): Promise<PageResult<QueryPayTypeBo>> {
  return defHttp.get<PageResult<QueryPayTypeBo>>(
    {
      url: baseUrl + '/query',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 根据ID查询
 * @param id
 */
export function get(id: string): Promise<GetPayTypeBo> {
  return defHttp.get<GetPayTypeBo>(
    {
      url: baseUrl,
      params: {
        id: id,
      },
    },
    {
      region,
    },
  );
}

/**
 * 新增
 * @param data
 */
export function create(data: CreatePayTypeVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl,
      data,
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 修改
 * @param data
 */
export function update(data: UpdatePayTypeVo): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl,
      data,
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 根据ID删除
 * @param id
 */
export function deleteById(id: string, showError: boolean = false): Promise<void> {
  return defHttp.delete<void>(
    {
      url: baseUrl,
      data: {
        id,
      },
    },
    {
      hiddenError: !showError,
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}
