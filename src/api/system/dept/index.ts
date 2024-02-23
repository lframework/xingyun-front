import { defHttp } from '/@/utils/http/axios';
import { SysDeptSelectorBo } from '@/api/system/dept/model/sysDeptSelectorBo';
import { SysDeptTreeBo } from '@/api/system/dept/model/sysDeptTreeBo';
import { GetSysDeptBo } from '@/api/system/dept/model/getSysDeptBo';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { CreateSysDeptVo } from '@/api/system/dept/model/createSysDeptVo';
import { UpdateSysDeptVo } from '@/api/system/dept/model/updateSysDeptVo';

const baseUrl = '/system/dept';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(params: void): Promise<SysDeptSelectorBo[]> {
  return defHttp.get<SysDeptSelectorBo[]>(
    {
      url: selectorBaseUrl + '/dept',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 部门树形菜单数据
 */
export function trees(): Promise<SysDeptTreeBo[]> {
  return defHttp.get<SysDeptTreeBo[]>(
    {
      url: baseUrl + '/trees',
    },
    {
      region,
    },
  );
}

/**
 * 部门详情
 * @param id
 */
export function get(id: string): Promise<GetSysDeptBo> {
  return defHttp.get<GetSysDeptBo>(
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
 * 批量停用部门
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
 * 批量启用部门
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
export function create(data: CreateSysDeptVo): Promise<void> {
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
export function update(data: UpdateSysDeptVo): Promise<void> {
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
