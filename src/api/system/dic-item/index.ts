import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { QuerySysDataDicItemBo } from '@/api/system/dic-item/model/querySysDataDicItemBo';
import { QuerySysDataDicItemVo } from '@/api/system/dic-item/model/querySysDataDicItemVo';
import { GetSysDataDicItemBo } from '@/api/system/dic-item/model/getSysDataDicItemBo';
import { CreateSysDataDicItemVo } from '@/api/system/dic-item/model/createSysDataDicItemVo';
import { UpdateSysDataDicItemVo } from '@/api/system/dic-item/model/updateSysDataDicItemVo';
import { SysDataDicItemBo } from '@/api/system/dic-item/model/sysDataDicItemBo';

const baseUrl = '/system/dic/item';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(params: QuerySysDataDicItemVo): Promise<PageResult<QuerySysDataDicItemBo>> {
  return defHttp.get<PageResult<QuerySysDataDicItemBo>>(
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
export function get(id: string): Promise<GetSysDataDicItemBo> {
  return defHttp.get<GetSysDataDicItemBo>(
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
 * 根据字典编号查询
 * @param code
 */
export function getByDicCode(code: string): Promise<SysDataDicItemBo[]> {
  return defHttp.get<SysDataDicItemBo[]>(
    {
      url: baseUrl + '/bydic',
      params: {
        code,
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
export function create(data: CreateSysDataDicItemVo): Promise<void> {
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
export function update(data: UpdateSysDataDicItemVo): Promise<void> {
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
 * @param data
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
