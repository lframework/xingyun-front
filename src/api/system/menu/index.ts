import { defHttp } from '/@/utils/http/axios';
import { QuerySysMenuBo } from './model/querySysMenuBo';
import { CreateSysMenuVo } from '@/api/system/menu/model/createSysMenuVo';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { GetSysMenuBo } from '@/api/system/menu/model/getSysMenuBo';
import { UpdateSysMenuVo } from '@/api/system/menu/model/updateSysMeneVo';
import { SysMenuSelectorBo } from '@/api/system/menu/model/sysMenuSelectorBo';
import { SysMenuSelectorVo } from '@/api/system/menu/model/sysMenuSelectorVo';
import { QuerySysMenuVo } from '@/api/system/menu/model/querySysMenuVo';

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
export function query(params: QuerySysMenuVo): Promise<QuerySysMenuBo[]> {
  return defHttp.get<QuerySysMenuBo[]>(
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
export function get(id: string, tenantId: number): Promise<GetSysMenuBo> {
  return defHttp.get<GetSysMenuBo>(
    {
      url: baseUrl,
      params: {
        id,
        tenantId,
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
export function deleteById(id: string, tenantId: number): Promise<void> {
  return defHttp.delete<void>(
    {
      url: baseUrl,
      data: {
        id,
        tenantId,
      },
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 启用
 * @param id
 */
export function enable(id: string, tenantId: number, showError: boolean = false): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/enable',
      data: {
        id,
        tenantId,
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
 * 停用
 * @param id
 */
export function unable(id: string, tenantId: number, showError: boolean = false): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/unable',
      data: {
        id,
        tenantId,
      },
    },
    {
      hiddenError: !showError,
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}
