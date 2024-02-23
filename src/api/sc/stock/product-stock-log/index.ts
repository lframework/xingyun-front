import { defHttp } from '/@/utils/http/axios';
import { ResponseEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QueryProductStockLogVo } from '@/api/sc/stock/product-stock-log/model/queryProductStockLogVo';
import { QueryProductStockLogBo } from '@/api/sc/stock/product-stock-log/model/queryProductStockLogBo';

const baseUrl = '/stock/product/log';
const region = 'cloud-api';

/**
 * 查询商品库存
 */
export function query(params: QueryProductStockLogVo): Promise<PageResult<QueryProductStockLogBo>> {
  return defHttp.get<PageResult<QueryProductStockLogBo>>(
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
 * 导出
 */
export function exportList(params: QueryProductStockLogVo): Promise<void> {
  return defHttp.get<void>(
    {
      url: baseUrl + '/export',
      params,
    },
    {
      region,
      responseType: ResponseEnum.BLOB,
    },
  );
}
