import { defHttp } from '@/utils/http/axios';
import { QueryFlowDefinitionVo } from '@/api/bpm/flow/definition/model/queryFlowDefinitionVo';
import { PageResult } from '@/api/model/pageResult';
import { QueryFlowDefinitionBo } from '@/api/bpm/flow/definition/model/queryFlowDefinitionBo';
import { CreateFlowDefinitionVo } from '@/api/bpm/flow/definition/model/createFlowDefinitionVo';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { SetFlowDefinitionPublishVo } from '@/api/bpm/flow/definition/model/setFlowDefinitionPublishVo';
import { UpdateFlowDefinitionVo } from '@/api/bpm/flow/definition/model/updateFlowDefinitionVo';
import { FlowDefinitionSelectorVo } from '@/api/bpm/flow/definition/model/flowDefinitionSelectorVo';
import { FlowDefinitionSelectorBo } from '@/api/bpm/flow/definition/model/flowDefinitionSelectorBo';

const baseUrl = '/flow/definition';
const selectorBaseUrl = '/selector/bpm';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(params: QueryFlowDefinitionVo): Promise<PageResult<QueryFlowDefinitionBo>> {
  return defHttp.get<PageResult<QueryFlowDefinitionBo>>(
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
 * 查询详情
 * @param id
 */
export function detail(id: string): Promise<void> {
  return defHttp.get<void>(
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
 * 新增
 * @param data
 */
export function create(data: CreateFlowDefinitionVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl,
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}

/**
 * 修改
 * @param data
 */
export function update(data: UpdateFlowDefinitionVo): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl,
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}

/**
 * 设置发布状态
 * @param data
 */
export function setPublishStatus(data: SetFlowDefinitionPublishVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/publish',
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}

/**
 * 设置激活状态
 * @param data
 */
export function setActivityStatus(data: SetFlowDefinitionPublishVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/activity',
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}

/**
 * 复制流程
 * @param data
 */
export function copy(data: UpdateFlowDefinitionVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/copy',
      data,
    },
    {
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
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

/**
 * 选择器
 * @param params
 */
export function selector(
  params: FlowDefinitionSelectorVo,
): Promise<PageResult<FlowDefinitionSelectorBo>> {
  return defHttp.get<PageResult<FlowDefinitionSelectorBo>>(
    {
      url: selectorBaseUrl + '/flow/definition',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 加载流程定义
 * @param ids
 */
export function loadFlowDefinition(ids: string[]): Promise<FlowDefinitionSelectorBo[]> {
  return defHttp.post<FlowDefinitionSelectorBo[]>(
    {
      url: selectorBaseUrl + '/flow/definition/load',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}
