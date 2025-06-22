import { defHttp } from '@/utils/http/axios';
import { QueryFlowCategoryTreeBo } from '@/api/bpm/flow/flow-category/model/queryFlowCategoryTreeBo';
import { DetailFlowCategoryBo } from '@/api/bpm/flow/flow-category/model/detailFlowCategoryBo';
import { CreateFlowCategoryVo } from '@/api/bpm/flow/flow-category/model/createFlowCategoryVo';
import { UpdateFlowCategoryVo } from '@/api/bpm/flow/flow-category/model/updateFlowCategoryVo';
import { ContentTypeEnum } from '@/enums/httpEnum';

const baseUrl = '/flow/category';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(): Promise<QueryFlowCategoryTreeBo[]> {
  return defHttp.get<QueryFlowCategoryTreeBo[]>(
    {
      url: baseUrl + '/query',
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
export function detail(id: number): Promise<DetailFlowCategoryBo> {
  return defHttp.get<DetailFlowCategoryBo>(
    {
      url: baseUrl + '/detail',
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
 * 创建
 * @param data
 */
export function create(data: CreateFlowCategoryVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl,
      data,
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
export function update(data: UpdateFlowCategoryVo): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl,
      data,
    },
    {
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
      params: {
        id,
      },
    },
    {
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}
