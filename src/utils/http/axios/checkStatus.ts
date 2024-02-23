import type { ErrorMessageMode } from '/#/axios';
import { useUserStoreWithOut } from '/@/store/modules/user';
import projectSetting from '/@/settings/projectSetting';
import { SessionTimeoutProcessingEnum } from '/@/enums/appEnum';
import { createError, createConfirm } from '@/hooks/web/msg';

const stp = projectSetting.sessionTimeoutProcessing;

export function checkStatus(
  status: number,
  msg: string,
  errorMessageMode: ErrorMessageMode = 'message',
): void {
  const userStore = useUserStoreWithOut();
  const errMessage = msg;

  switch (status) {
    case 401:
      userStore.setToken(undefined);
      createConfirm(
        '由于您长时间未操作，已经自动退出登录，您可以取消以停留在此页面，或重新登录。',
        '确认重新登录',
        {
          okText: '重新登录',
          cancelText: '取消',
        },
      ).then(() => {
        if (stp === SessionTimeoutProcessingEnum.PAGE_COVERAGE) {
          userStore.setSessionTimeout(true);
        } else {
          userStore.logout(true);
        }
      });
      return;
    default:
  }
  if (errMessage) {
    if (errorMessageMode !== 'none') {
      createError(errMessage);
    }
  }
}
