// @ts-nocheck
import type { Menu } from '/@/router/types';

describe('getFirstLeafMenuPath', () => {
  test('returns the first reachable leaf path recursively', async () => {
    const menuHelper = await import('/@/router/helper/menuHelper');

    expect(typeof menuHelper.getFirstLeafMenuPath).toBe('function');

    const menus: Menu[] = [
      {
        name: '采购管理',
        path: '/purchase',
        children: [
          {
            name: '订单中心',
            path: '/purchase/order',
            children: [
              {
                name: '采购订单',
                path: '/purchase/order/list',
              },
            ],
          },
          {
            name: '供应商',
            path: '/purchase/vendor',
          },
        ],
      },
    ];

    expect(menuHelper.getFirstLeafMenuPath(menus)).toBe('/purchase/order/list');
  });

  test('treats hideChildrenInMenu nodes as final pages', async () => {
    const menuHelper = await import('/@/router/helper/menuHelper');

    expect(typeof menuHelper.getFirstLeafMenuPath).toBe('function');

    const menus: Menu[] = [
      {
        name: '报表',
        path: '/report',
        meta: {
          hideChildrenInMenu: true,
        },
        children: [
          {
            name: '销售日报',
            path: '/report/day',
          },
        ],
      },
    ];

    expect(menuHelper.getFirstLeafMenuPath(menus)).toBe('/report');
  });
});
