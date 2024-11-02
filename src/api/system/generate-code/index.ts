import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { UpdateSysGenerateCodeVo } from '@/api/system/generate-code/model/updateSysGenerateCodeVo';
import { CreateSysGenerateCodeVo } from '@/api/system/generate-code/model/createSysGenerateCodeVo';
import { GetSysGenerateCodeBo } from '@/api/system/generate-code/model/getSysGenerateCodeBo';
import { QuerySysGenerateCodeVo } from '@/api/system/generate-code/model/querySysGenerateCodeVo';
import { QuerySysGenerateCodeBo } from '@/api/system/generate-code/model/querySysGenerateCodeBo';
import { SettingSysGenerateCodeVo } from '@/api/system/generate-code/model/settingSysGenerateCodeVo';
import { PreviewSysGenerateCodeVo } from '@/api/system/generate-code/model/previewSysGenerateCodeVo';

const baseUrl = '/system/generate/code';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(params: QuerySysGenerateCodeVo): Promise<PageResult<QuerySysGenerateCodeBo>> {
  return defHttp.get<PageResult<QuerySysGenerateCodeBo>>(
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
export function get(id: string): Promise<GetSysGenerateCodeBo> {
  return defHttp.get<GetSysGenerateCodeBo>(
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
export function create(data: CreateSysGenerateCodeVo): Promise<void> {
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
export function update(data: UpdateSysGenerateCodeVo): Promise<void> {
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
 * @param id
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
 * 设置
 * @param data
 */
export function setting(data: SettingSysGenerateCodeVo): Promise<void> {
  return defHttp.patch<void>(
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
 * 预览
 * @param data
 */
export function preview(data: PreviewSysGenerateCodeVo): Promise<string> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/preview',
      data,
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}
