import { defHttp } from '@/utils/http/axios';
import { UserInfoBo } from '@/api/sys/model/userInfoBo';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { PageResult } from '@/api/model/pageResult';
import { OpLogInUserCenterBo } from '@/api/sys/model/opLogInUserCenterBo';
import { QueryOpLogsVo } from '@/api/sys/model/queryOpLogsVo';

const baseUrl = '/center';
const region = 'cloud-api';

/**
 * 获取用户信息
 */
export function getInfo(): Promise<UserInfoBo> {
  return defHttp.get<UserInfoBo>(
    {
      url: baseUrl + '/info',
    },
    {
      region,
    },
  );
}

/**
 * 修改密码
 */
export function updatePassword({
  oldPsw,
  newPsw,
  confirmPsw,
}: {
  oldPsw: string;
  newPsw: string;
  confirmPsw: string;
}): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/password',
      data: {
        oldPsw,
        newPsw,
        confirmPsw,
      },
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 修改邮箱
 */
export function updateEmail({
  newEmail,
  confirmEmail,
}: {
  newEmail: string;
  confirmEmail: string;
}): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/email',
      data: {
        newEmail,
        confirmEmail,
      },
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 修改联系电话
 */
export function updateTelephone({
  newTelephone,
  confirmTelephone,
}: {
  newTelephone: string;
  confirmTelephone: string;
}): Promise<void> {
  return defHttp.patch<void>(
    {
      url: baseUrl + '/telephone',
      data: {
        newTelephone,
        confirmTelephone,
      },
    },
    {
      contentType: ContentTypeEnum.FORM_URLENCODED,
      region,
    },
  );
}

/**
 * 查询操作日志
 */
export function oplog(params: QueryOpLogsVo): Promise<PageResult<OpLogInUserCenterBo>> {
  return defHttp.get<PageResult<OpLogInUserCenterBo>>(
    {
      url: baseUrl + '/oplog',
      params,
    },
    {
      region,
    },
  );
}
