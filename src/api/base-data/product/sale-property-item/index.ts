import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { UpdateProductSalePropertyItemVo } from '@/api/base-data/product/sale-property-item/model/updateProductSalePropertyItemVo';
import { CreateProductSalePropertyItemVo } from '@/api/base-data/product/sale-property-item/model/createProductSalePropertyItemVo';
import { GetProductSalePropertyItemBo } from '@/api/base-data/product/sale-property-item/model/getProductSalePropertyItemBo';
import { QueryProductSalePropertyItemVo } from '@/api/base-data/product/sale-property-item/model/queryProductSalePropertyItemVo';
import { QueryProductSalePropertyItemBo } from '@/api/base-data/product/sale-property-item/model/queryProductSalePropertyItemBo';

const baseUrl = '/basedata/product/sale/property/item';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(
  params: QueryProductSalePropertyItemVo,
): Promise<PageResult<QueryProductSalePropertyItemBo>> {
  return defHttp.get<PageResult<QueryProductSalePropertyItemBo>>(
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
export function get(id: string): Promise<GetProductSalePropertyItemBo> {
  return defHttp.get<GetProductSalePropertyItemBo>(
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
export function create(data: CreateProductSalePropertyItemVo): Promise<void> {
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
export function update(data: UpdateProductSalePropertyItemVo): Promise<void> {
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
