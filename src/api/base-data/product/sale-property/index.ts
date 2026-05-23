import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { ProductSalePropertyModelorBo } from '@/api/base-data/product/sale-property/model/productSalePropertyModelorBo';
import { UpdateProductSalePropertyVo } from '@/api/base-data/product/sale-property/model/updateProductSalePropertyVo';
import { CreateProductSalePropertyVo } from '@/api/base-data/product/sale-property/model/createProductSalePropertyVo';
import { GetProductSalePropertyBo } from '@/api/base-data/product/sale-property/model/getProductSalePropertyBo';
import { QueryProductSalePropertyVo } from '@/api/base-data/product/sale-property/model/queryProductSalePropertyVo';
import { QueryProductSalePropertyBo } from '@/api/base-data/product/sale-property/model/queryProductSalePropertyBo';
import { RelatedProductCategoryBo } from '@/api/base-data/product/category/model/relatedProductCategoryBo';

const baseUrl = '/basedata/product/sale/property';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(
  params: QueryProductSalePropertyVo,
): Promise<PageResult<QueryProductSalePropertyBo>> {
  return defHttp.get<PageResult<QueryProductSalePropertyBo>>(
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
export function get(id: string): Promise<GetProductSalePropertyBo> {
  return defHttp.get<GetProductSalePropertyBo>(
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
 * 查询已关联商品分类
 * @param id
 */
export function queryCategories(id: string): Promise<RelatedProductCategoryBo[]> {
  return defHttp.get<RelatedProductCategoryBo[]>(
    {
      url: baseUrl + '/categories',
      params: {
        id,
      },
    },
    {
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

/**
 * 新增
 * @param data
 */
export function create(data: CreateProductSalePropertyVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl,
      data,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 修改
 * @param data
 */
export function update(data: UpdateProductSalePropertyVo): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl,
      data,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 销售属性模型
 */
export function getModelor(): Promise<ProductSalePropertyModelorBo[]> {
  return defHttp.get<ProductSalePropertyModelorBo[]>(
    {
      url: baseUrl + '/modelor',
    },
    {
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
