import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { SysPositionSelectorBo } from '@/api/system/position/model/sysPositionSelectorBo';
import { SysPositionSelectorVo } from '@/api/system/position/model/sysPositionSelectorVo';
import { QuerySysPositionBo } from '@/api/system/position/model/querySysPositionBo';
import { QuerySysPositionVo } from '@/api/system/position/model/querySysPositionVo';
import { GetSysPositionBo } from '@/api/system/position/model/getSysPositionBo';
import { CreateSysPositionVo } from '@/api/system/position/model/createSysPositionVo';
import { UpdateSysPositionVo } from '@/api/system/position/model/updateSysPositionVo';

const baseUrl = '/system/position';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(
  params: SysPositionSelectorVo,
): Promise<PageResult<SysPositionSelectorBo>> {
  return defHttp.get<PageResult<SysPositionSelectorBo>>(
    {
      url: selectorBaseUrl + '/position',
      params,
    },
    {
      region,
    },
  );
}

export function loadPosition(ids: string[]): Promise<SysPositionSelectorBo[]> {
  return defHttp.post<SysPositionSelectorBo[]>(
    {
      url: selectorBaseUrl + '/position/load',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}

/**
 * 岗位列表
 */
export function query(params: QuerySysPositionVo): Promise<PageResult<QuerySysPositionBo>> {
  return defHttp.get<PageResult<QuerySysPositionBo>>(
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
 * 查询岗位
 * @param id
 */
export function get(id: string): Promise<GetSysPositionBo> {
  return defHttp.get<GetSysPositionBo>(
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
 * 批量停用岗位
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
 * 批量启用岗位
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
 * 新增
 * @param data
 */
export function create(data: CreateSysPositionVo): Promise<void> {
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
export function update(data: UpdateSysPositionVo): Promise<void> {
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
