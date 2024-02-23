import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';
import { ContentTypeEnum } from '@/enums/httpEnum';

enum Api {
  GetMenuList = '/auth/menus',
  CollectMenu = '/menu/collect',
  CancelCollectMenu = '/menu/collect/cancel',
  GetCollectMenu = '/menu/collect',
}

const region = 'cloud-api';

/**
 * @description: Get user menu based on id
 */

export const getMenuList = (): Promise<getMenuListResultModel> => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList }, { region });
};

/**
 * 收藏菜单
 * @param menuId
 */
export const collectMenu = (menuId: string): Promise<void> => {
  return defHttp.post<void>(
    { url: Api.CollectMenu, data: { menuId } },
    { contentType: ContentTypeEnum.FORM_URLENCODED, region },
  );
};

/**
 * 取消收藏菜单
 * @param menuId
 */
export const cancelCollectMenu = (menuId: string): Promise<void> => {
  return defHttp.post<void>(
    { url: Api.CancelCollectMenu, data: { menuId } },
    { contentType: ContentTypeEnum.FORM_URLENCODED, region },
  );
};

/**
 * 查询收藏的菜单
 * @param menuId
 */
export const getCollectMenu = (): Promise<void> => {
  return defHttp.get<void>({ url: Api.GetCollectMenu }, { region });
};
