import { defHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { CreateDirVo } from '@/api/smart-work/file-box/model/createDirVo';
import { PageResult } from '@/api/model/pageResult';
import { QueryFileBoxVo } from '@/api/smart-work/file-box/model/queryFileBoxVo';
import { QueryFileBoxBo } from '@/api/smart-work/file-box/model/queryFileBoxBo';
import { UploadFileBoxVo } from '@/api/smart-work/file-box/model/uploadFileBoxVo';
import { GetFileBoxBo } from '@/api/smart-work/file-box/model/getFileBoxBo';
import { UpdateFileBoxVo } from '@/api/smart-work/file-box/model/updateFileBoxVo';

const baseUrl = '/sw/filebox';
const region = 'cloud-api';

/**
 * 创建文件夹
 */
export function createDir(data: CreateDirVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/dir',
      data,
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 查询列表
 */
export function query(params: QueryFileBoxVo): Promise<PageResult<QueryFileBoxBo>> {
  return defHttp.get<PageResult<QueryFileBoxBo>>(
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
 * 上传文件
 */
export function upload(data: UploadFileBoxVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/upload',
      data,
    },
    {
      contentType: ContentTypeEnum.BLOB,
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
 * 查询详情
 */
export function get(id: string): Promise<GetFileBoxBo> {
  return defHttp.get<GetFileBoxBo>(
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
 * @param data
 */
export function update(data: UpdateFileBoxVo): Promise<void> {
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
