import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { GetQrtzBo } from '@/api/development/qrtz/model/getQrtzBo';
import { QueryQrtzVo } from '@/api/development/qrtz/model/queryQrtzVo';
import { QueryQrtzBo } from '@/api/development/qrtz/model/queryQrtzBo';
import { CreateQrtzVo } from '@/api/development/qrtz/model/createQrtzVo';
import { UpdateQrtzVo } from '@/api/development/qrtz/model/updateQrtzVo';

const baseUrl = '/qrtz';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(params: QueryQrtzVo): Promise<PageResult<QueryQrtzBo>> {
  return defHttp.get<PageResult<QueryQrtzBo>>(
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
 * 查询
 */
export function get({ name, group }: { name: string; group: string }): Promise<GetQrtzBo> {
  return defHttp.get<GetQrtzBo>(
    {
      url: baseUrl,
      params: {
        name,
        group,
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
export function create(data: CreateQrtzVo): Promise<void> {
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
export function update(data: UpdateQrtzVo): Promise<void> {
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
 * 暂停
 */
export function pause({ name, group }: { name: string; group: string }): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl + '/pause',
      data: {
        name,
        group,
      },
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 恢复
 */
export function resume({ name, group }: { name: string; group: string }): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl + '/resume',
      data: {
        name,
        group,
      },
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 触发
 */
export function trigger({ name, group }: { name: string; group: string }): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl + '/trigger',
      data: {
        name,
        group,
      },
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 删除
 */
export function deleteJob({ name, group }: { name: string; group: string }): Promise<void> {
  return defHttp.delete<void>(
    {
      url: baseUrl,
      data: {
        name,
        group,
      },
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}
