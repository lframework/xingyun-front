import { defHttp } from '/@/utils/http/axios';
import { ResponseEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { QueryProductStockVo } from '@/api/sc/stock/product-stock/model/queryProductStockVo';
import { QueryProductStockBo } from '@/api/sc/stock/product-stock/model/queryProductStockBo';

const baseUrl = '/stock/product';
const region = 'cloud-api';

/**
 * 查询商品库存
 */
export function query(params: QueryProductStockVo): Promise<PageResult<QueryProductStockBo>> {
  return defHttp.get<PageResult<QueryProductStockBo>>(
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
export function exportList(params: QueryProductStockVo): Promise<void> {
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
