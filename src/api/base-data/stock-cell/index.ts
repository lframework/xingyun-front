import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { QueryStockCellSelectorVo } from '@/api/base-data/stock-cell/model/queryStockCellSelectorVo';
import { StockCellSelectorBo } from '@/api/base-data/stock-cell/model/stockCellSelectorBo';
import { QueryStockCellBo } from '@/api/base-data/stock-cell/model/queryStockCellBo';
import { QueryStockCellVo } from '@/api/base-data/stock-cell/model/queryStockCellVo';
import { GetStockCellBo } from '@/api/base-data/stock-cell/model/getStockCellBo';
import { CreateStockCellVo } from '@/api/base-data/stock-cell/model/createStockCellVo';
import { UpdateStockCellVo } from '@/api/base-data/stock-cell/model/updateStockCellVo';

const baseUrl = '/basedata/stock-cell';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: QueryStockCellSelectorVo,
): Promise<PageResult<StockCellSelectorBo>> {
  return defHttp.get<PageResult<StockCellSelectorBo>>(
    {
      url: selectorBaseUrl + '/stock-cell',
      params,
    },
    {
      region,
    },
  );
}

export function loadStockCell(ids: string[]): Promise<StockCellSelectorBo[]> {
  return defHttp.post<StockCellSelectorBo[]>(
    {
      url: selectorBaseUrl + '/stock-cell/load',
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
export function query(params: QueryStockCellVo): Promise<PageResult<QueryStockCellBo>> {
  return defHttp.get<PageResult<QueryStockCellBo>>(
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
export function get(id: string): Promise<GetStockCellBo> {
  return defHttp.get<GetStockCellBo>(
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
export function create(data: CreateStockCellVo): Promise<void> {
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
export function update(data: UpdateStockCellVo): Promise<void> {
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
      hiddenError: true,
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
