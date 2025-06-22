import { defHttp } from '@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { QueryTodoTaskListVo } from '@/api/bpm/flow/task/model/queryTodoTaskListVo';
import { QueryTodoTaskListBo } from '@/api/bpm/flow/task/model/queryTodoTaskListBo';
import { ApprovePassTaskVo } from '@/api/bpm/flow/task/model/approvePassTaskVo';
import { ApproveRefuseTaskVo } from '@/api/bpm/flow/task/model/approveRefuseTaskVo';
import { QueryMyTaskListBo } from '@/api/bpm/flow/task/model/queryMyTaskListBo';
import { QueryMyTaskListVo } from '@/api/bpm/flow/task/model/queryMyTaskListVo';
import { UndoTaskVo } from '@/api/bpm/flow/task/model/undoTaskVo';
import { RejectTaskVo } from '@/api/bpm/flow/task/model/rejectTaskVo';
import { QueryInstanceListBo } from '@/api/bpm/flow/task/model/queryInstanceListBo';
import { QueryInstanceListVo } from '@/api/bpm/flow/task/model/queryInstanceListVo';
import { ContentTypeEnum } from '@/enums/httpEnum';

const baseUrl = '/flow/task';
const region = 'cloud-api';

/**
 * 查询待办任务列表
 */
export function queryTodoList(
  params: QueryTodoTaskListVo,
): Promise<PageResult<QueryTodoTaskListBo>> {
  return defHttp.get<PageResult<QueryTodoTaskListBo>>(
    {
      url: baseUrl + '/list/todo',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 查询我的发起列表
 */
export function queryMyList(params: QueryMyTaskListVo): Promise<PageResult<QueryMyTaskListBo>> {
  return defHttp.get<PageResult<QueryMyTaskListBo>>(
    {
      url: baseUrl + '/list/my',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 查询流程实例列表
 */
export function queryInstanceList(
  params: QueryInstanceListVo,
): Promise<PageResult<QueryInstanceListBo>> {
  return defHttp.get<PageResult<QueryInstanceListBo>>(
    {
      url: baseUrl + '/list/instance',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 根据ID查询审核类型
 */
export function getCooperateType(id: string): Promise<number> {
  return defHttp.get<number>(
    {
      url: baseUrl + '/cooperate',
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
 * 审核通过
 * @param params
 */
export function approvePass(params: ApprovePassTaskVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/approve/pass',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 审核拒绝
 * @param params
 */
export function approveRefuse(params: ApproveRefuseTaskVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/approve/refuse',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 撤回
 * @param params
 */
export function undo(params: UndoTaskVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/undo',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 反对
 * @param params
 */
export function reject(params: RejectTaskVo): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/reject',
      params,
    },
    {
      region,
    },
  );
}

/**
 * 终止
 * @param instanceId
 */
export function termination(instanceId: string): Promise<void> {
  return defHttp.post<void>(
    {
      url: baseUrl + '/termination',
      params: {
        instanceId,
      },
    },
    {
      region,
      contentType: ContentTypeEnum.FORM_URLENCODED,
    },
  );
}
