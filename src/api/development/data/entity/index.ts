import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { QueryDataEntityBo } from '@/api/development/data/entity/model/queryDataEntityBo';
import { QueryDataEntityVo } from '@/api/development/data/entity/model/queryDataEntityVo';
import { GenDataEntityDetailBo } from '@/api/development/data/entity/model/genDataEntityDetailBo';
import { QuerySimpleTableColumnVo } from '@/api/development/data/entity/model/querySimpleTableColumnVo';
import { GetDataEntityBo } from '@/api/development/data/entity/model/getDataEntityBo';
import { CreateDataEntityVo } from '@/api/development/data/entity/model/createDataEntityVo';
import { UpdateDataEntityVo } from '@/api/development/data/entity/model/updateDataEntityVo';
import { UpdateDataEntityGenerateVo } from '@/api/development/data/entity/model/updateDataEntityGenerateVo';
import { GenDataEntitySelectorVo } from '@/api/development/data/entity/model/genDataEntitySelectorVo';
import { GenDataEntitySelectorBo } from '@/api/development/data/entity/model/genDataEntitySelectorBo';

const baseUrl = '/gen/data/entity';
const selectorBaseUrl = '/selector/gen';
const region = 'cloud-api';

export function selector(
  params: GenDataEntitySelectorVo,
): Promise<PageResult<GenDataEntitySelectorBo>> {
  return defHttp.get<PageResult<GenDataEntitySelectorBo>>(
    {
      url: selectorBaseUrl + '/data/entity',
      params,
    },
    {
      region,
    },
  );
}

export function loadDataEntity(ids: string[]): Promise<GenDataEntitySelectorBo[]> {
  return defHttp.post<GenDataEntitySelectorBo[]>(
    {
      url: selectorBaseUrl + '/data/entity/load',
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
export function query(params: QueryDataEntityVo): Promise<PageResult<QueryDataEntityBo>> {
  return defHttp.get<PageResult<QueryDataEntityBo>>(
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
 * 查询列信息
 */
export function getColumns(params: QuerySimpleTableColumnVo): Promise<GenDataEntityDetailBo[]> {
  return defHttp.get<GenDataEntityDetailBo[]>(
    {
      url: baseUrl + '/query/columns',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 查询
 */
export function get(id: string): Promise<GetDataEntityBo> {
  return defHttp.get<GetDataEntityBo>(
    {
      url: baseUrl,
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
 * 新增
 * @param data
 */
export function create(data: CreateDataEntityVo): Promise<void> {
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
export function update(data: UpdateDataEntityVo): Promise<void> {
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
 * 删除
 */
export function deleteById(id: string): Promise<void> {
  return defHttp.delete<void>(
    {
      url: baseUrl,
      data: {
        id,
      },
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 批量删除
 */
export function batchDelete(ids: string[]): Promise<void> {
  return defHttp.delete<void>(
    {
      url: baseUrl + '/batch',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 批量停用
 * @param ids
 */
export function batchUnable(ids: string[]): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/unable/batch',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 批量启用
 * @param ids
 */
export function batchEnable(ids: string[]): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/enable/batch',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 获取生成代码配置
 */
export function getGenerate(id: string): Promise<void> {
  return defHttp.get<void>(
    {
      url: baseUrl + '/generate',
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
 * 修改生成代码配置
 */
export function updateGenerate(data: UpdateDataEntityGenerateVo): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/generate',
      data,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 预览
 */
export function preview(id: string): Promise<void> {
  return defHttp.get<void>(
    {
      url: baseUrl + '/preview',
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
 * 下载
 */
export function download(id: string): Promise<void> {
  return defHttp.get<void>(
    {
      url: baseUrl + '/download',
      params: {
        id,
      },
    },
    {
      responseType: ResponseEnum.BLOB,
      region,
    },
  );
}

/**
 * 同步数据表
 */
export function syncTable(id: string): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl + '/sync/table',
      params: {
        id,
      },
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}
