import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum, ResponseEnum } from '@/enums/httpEnum';
import { QueryMemberSelectorVo } from '@/api/base-data/member/model/queryMemberSelectorVo';
import { MemberSelectorBo } from '@/api/base-data/member/model/memberSelectorBo';
import { UpdateMemberVo } from '@/api/base-data/member/model/updateMemberVo';
import { CreateMemberVo } from '@/api/base-data/member/model/createMemberVo';
import { GetMemberBo } from '@/api/base-data/member/model/getMemberBo';
import { QueryMemberVo } from '@/api/base-data/member/model/queryMemberVo';
import { QueryMemberBo } from '@/api/base-data/member/model/queryMemberBo';

const baseUrl = '/basedata/member';
const selectorBaseUrl = '/selector';
const region = 'cloud-api';

export function selector(params: QueryMemberSelectorVo): Promise<PageResult<MemberSelectorBo>> {
  return defHttp.get<PageResult<MemberSelectorBo>>(
    {
      url: selectorBaseUrl + '/member',
      params,
    },
    {
      region,
    },
  );
}

export function loadMember(ids: string[]): Promise<MemberSelectorBo[]> {
  return defHttp.post<MemberSelectorBo[]>(
    {
      url: selectorBaseUrl + '/member/load',
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
export function query(params: QueryMemberVo): Promise<PageResult<QueryMemberBo>> {
  return defHttp.get<PageResult<QueryMemberBo>>(
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
export function get(id: string): Promise<GetMemberBo> {
  return defHttp.get<GetMemberBo>(
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
 * 新增
 * @param data
 */
export function create(data: CreateMemberVo): Promise<void> {
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
export function update(data: UpdateMemberVo): Promise<void> {
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
      region,
    },
  );
}
