import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { UpdateProductPropertyItemVo } from '@/api/base-data/product/property-item/model/updateProductPropertyItemVo';
import { CreateProductPropertyItemVo } from '@/api/base-data/product/property-item/model/createProductPropertyItemVo';
import { GetProductPropertyItemBo } from '@/api/base-data/product/property-item/model/getProductPropertyItemBo';
import { QueryProductPropertyItemVo } from '@/api/base-data/product/property-item/model/queryProductPropertyItemVo';
import { QueryProductPropertyItemBo } from '@/api/base-data/product/property-item/model/queryProductPropertyItemBo';

const baseUrl = '/basedata/product/property/item';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(
  params: QueryProductPropertyItemVo,
): Promise<PageResult<QueryProductPropertyItemBo>> {
  return defHttp.get<PageResult<QueryProductPropertyItemBo>>(
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
export function get(id: string): Promise<GetProductPropertyItemBo> {
  return defHttp.get<GetProductPropertyItemBo>(
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
export function create(data: CreateProductPropertyItemVo): Promise<void> {
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
export function update(data: UpdateProductPropertyItemVo): Promise<void> {
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
