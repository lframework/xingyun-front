import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { UpdateSysParameterVo } from '@/api/system/parameter/model/updateSysParameterVo';
import { CreateSysParameterVo } from '@/api/system/parameter/model/createSysParameterVo';
import { GetSysParameterBo } from '@/api/system/parameter/model/getSysParameterBo';
import { QuerySysParameterVo } from '@/api/system/parameter/model/querySysParameterVo';
import { QuerySysParameterBo } from '@/api/system/parameter/model/querySysParameterBo';

const baseUrl = '/system/parameter';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(params: QuerySysParameterVo): Promise<PageResult<QuerySysParameterBo>> {
  return defHttp.get<PageResult<QuerySysParameterBo>>(
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
export function get(id: string): Promise<GetSysParameterBo> {
  return defHttp.get<GetSysParameterBo>(
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
export function create(data: CreateSysParameterVo): Promise<void> {
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
export function update(data: UpdateSysParameterVo): Promise<void> {
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
