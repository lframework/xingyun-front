import { defHttp } from '/@/utils/http/axios';
import { PageResult } from '@/api/model/pageResult';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { SimpleDBSelectorBo } from '@/api/development/gen/simple-db/model/simpleDBSelectorBo';
import { SimpleTableSelectorVo } from '@/api/development/gen/simple-db/model/simpleTableSelectorVo';

const selectorBaseUrl = '/selector/gen';
const region = 'cloud-api';

export function selector(params: SimpleTableSelectorVo): Promise<PageResult<SimpleDBSelectorBo>> {
  return defHttp.get<PageResult<SimpleDBSelectorBo>>(
    {
      url: selectorBaseUrl + '/table',
      params,
    },
    {
      region,
    },
  );
}

export function loadTable(ids: string[]): Promise<SimpleDBSelectorBo[]> {
  return defHttp.post<SimpleDBSelectorBo[]>(
    {
      url: selectorBaseUrl + '/table/load',
      data: ids,
    },
    {
      contentType: ContentTypeEnum.JSON,
      region,
    },
  );
}
