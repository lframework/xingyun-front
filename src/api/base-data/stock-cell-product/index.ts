import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { QueryStockCellProductBo } from '@/api/base-data/stock-cell-product/model/queryStockCellProductBo';
import { QueryStockCellProductVo } from '@/api/base-data/stock-cell-product/model/queryStockCellProductVo';
import { CreateStockCellProductVo } from '@/api/base-data/stock-cell-product/model/createStockCellProductVo';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';

const baseUrl = '/basedata/stock-cell/product';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(
  params: QueryStockCellProductVo,
): Promise<PageResult<QueryStockCellProductBo>> {
  return defHttp.get<PageResult<QueryStockCellProductBo>>(
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
 * 新增
 * @param data
 */
export function create(data: CreateStockCellProductVo): Promise<void> {
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

/**
 * 下载指定仓位导入模板
 */
export function downloadImportByCellTemplate(): Promise<void> {
  return defHttp.get<void>(
    {
      url: baseUrl + '/import/by-cell/template',
    },
    {
      responseType: ResponseEnum.BLOB,
      region,
    },
  );
}

/**
 * 指定仓位导入
 */
export function importExcelByCell(data: {
  id: string;
  file: Blob;
  stockCellId: string;
}): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/import/by-cell',
      data,
    },
    {
      contentType: ContentTypeEnum.BLOB,
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
