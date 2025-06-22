import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { UpdatePrintTemplateVo } from '@/api/base-data/print-template/model/updatePrintTemplateVo';
import { CreatePrintTemplateVo } from '@/api/base-data/print-template/model/createPrintTemplateVo';
import { GetPrintTemplateBo } from '@/api/base-data/print-template/model/getPrintTemplateBo';
import { QueryPrintTemplateVo } from '@/api/base-data/print-template/model/queryPrintTemplateVo';
import { QueryPrintTemplateBo } from '@/api/base-data/print-template/model/queryPrintTemplateBo';
import { GetPrintTemplateSettingBo } from '@/api/base-data/print-template/model/getPrintTemplateSettingBo';
import { UpdatePrintTemplateSettingVo } from '@/api/base-data/print-template/model/updatePrintTemplateSettingVo';
import { UpdatePrintTemplateDemoDataVo } from '@/api/base-data/print-template/model/updatePrintTemplateDemoDataVo';
import { GetPrintTemplateCompSettingBo } from '@/api/base-data/print-template/model/getPrintTemplateCompSettingBo';

const baseUrl = '/basedata/print/template';
const region = 'cloud-api';

/**
 * 查询列表
 */
export function query(params: QueryPrintTemplateVo): Promise<PageResult<QueryPrintTemplateBo>> {
  return defHttp.get<PageResult<QueryPrintTemplateBo>>(
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
export function get(id: string): Promise<GetPrintTemplateBo> {
  return defHttp.get<GetPrintTemplateBo>(
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
export function create(data: CreatePrintTemplateVo): Promise<void> {
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
export function update(data: UpdatePrintTemplateVo): Promise<void> {
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
 * 查询设置
 * @param id
 */
export function getSetting(id: string): Promise<GetPrintTemplateSettingBo> {
  return defHttp.get<GetPrintTemplateSettingBo>(
    {
      url: baseUrl + '/setting',
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
 * 修改设置
 * @param data
 */
export function updateSetting(data: UpdatePrintTemplateSettingVo): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl + '/setting',
      data,
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 修改示例数据
 * @param data
 */
export function updateDemoData(data: UpdatePrintTemplateDemoDataVo): Promise<void> {
  return defHttp.put<void>(
    {
      url: baseUrl + '/setting/demo',
      data,
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 查询组件设置
 * @param id
 */
export function getTemplateComp(id: string): Promise<GetPrintTemplateCompSettingBo[]> {
  return defHttp.get<GetPrintTemplateCompSettingBo[]>(
    {
      url: baseUrl + '/setting/comp',
      params: {
        id: id,
      },
    },
    {
      region,
    },
  );
}
