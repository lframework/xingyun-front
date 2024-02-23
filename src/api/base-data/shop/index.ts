import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { QueryShopSelectorVo } from '@/api/base-data/shop/model/queryShopSelectorVo';
import { ShopSelectorBo } from '@/api/base-data/shop/model/shopSelectorBo';
import { UpdateShopVo } from '@/api/base-data/shop/model/updateShopVo';
import { CreateShopVo } from '@/api/base-data/shop/model/createShopVo';
import { GetShopBo } from '@/api/base-data/shop/model/getShopBo';
import { QueryShopVo } from '@/api/base-data/shop/model/queryShopVo';
import { QueryShopBo } from '@/api/base-data/shop/model/queryShopBo';

const baseUrl = '/basedata/shop';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(params: QueryShopSelectorVo): Promise<PageResult<ShopSelectorBo>> {
  return defHttp.get<PageResult<ShopSelectorBo>>(
    {
      url: selectorBaseUrl + '/shop',
      params,
    },
    {
      region,
    },
  );
}

export function loadShop(ids: string[]): Promise<ShopSelectorBo[]> {
  return defHttp.post<ShopSelectorBo[]>(
    {
      url: selectorBaseUrl + '/shop/load',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 查询列表
 */
export function query(params: QueryShopVo): Promise<PageResult<QueryShopBo>> {
  return defHttp.get<PageResult<QueryShopBo>>(
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
export function get(id: string): Promise<GetShopBo> {
  return defHttp.get<GetShopBo>(
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
export function create(data: CreateShopVo): Promise<void> {
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
export function update(data: UpdateShopVo): Promise<void> {
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
 * 下载导入模板
 */
export function downloadImportTemplate(): Promise<void> {
  return defHttp.get<void>(
    {
      url: baseUrl + '/import/template',
    },
    {
      responseType: ResponseEnum.BLOB,
      region,
    },
  );
}

/**
 * 导入
 */
export function importExcel(data: { id: string; file: Blob }): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/import',
      data,
    },
    {
      contentType: ContentTypeEnum.BLOB,
      region,
    },
  );
}
