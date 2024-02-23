import { defHttp } from '/@/utils/http/axios';
import { QuerySysMenuBo } from './model/querySysMenuBo';
import { CreateSysMenuVo } from '@/api/system/menu/model/createSysMenuVo';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { GetSysMenuBo } from '@/api/system/menu/model/getSysMenuBo';
import { UpdateSysMenuVo } from '@/api/system/menu/model/updateSysMeneVo';
import { SysMenuSelectorBo } from '@/api/system/menu/model/sysMenuSelectorBo';
import { SysMenuSelectorVo } from '@/api/system/menu/model/sysMenuSelectorVo';

const baseUrl = '/system/menu';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(params: SysMenuSelectorVo): Promise<SysMenuSelectorBo[]> {
  return defHttp.get<SysMenuSelectorBo[]>(
    {
      url: selectorBaseUrl + '/menu',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 查询列表
 */
export function query(): Promise<QuerySysMenuBo[]> {
  return defHttp.get<QuerySysMenuBo[]>(
    {
      url: baseUrl + '/query',
    },
    {
      region,
    },
  );
}

/**
 * 新增
 * @param vo
 */
export function create(vo: CreateSysMenuVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl,
      data: vo,
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 根据ID查询
 * @param id
 */
export function get(id: string): Promise<GetSysMenuBo> {
  return defHttp.get<GetSysMenuBo>(
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
 * 修改
 * @param vo
 */
export function update(vo: UpdateSysMenuVo): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl,
      data: vo,
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
export function deleteById(id: string): Promise<void> {
  return defHttp.delete<void>(
    {
      url: baseUrl,
      data: {
        id: id,
      },
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
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
