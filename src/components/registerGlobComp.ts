import type { App } from 'vue';
import { h } from 'vue';
import Antd, { Empty } from 'ant-design-vue';
import VXETable from 'vxe-table';
import VxeUI from 'vxe-pc-ui';
import VxeUIPluginRenderAntd from '@vxe-ui/plugin-render-antd';
import JForm from '@/components/JForm';
import JFormItem from '@/components/JFormItem';
import DialogTable from '@/components/DialogTable';
import DialogTree from '@/components/DialogTree';
import JBorder from '@/components/JBorder';
import JImgUpload from '@/components/JImgUpload';
import { Icon } from '@/components/Icon';
import { install as enumsInstall } from '@/enums/biz';
import { install as selectorInstall } from '@/components/Selector';
import { install as importorInstall } from '@/components/Importor';
import { install as tagInstall } from '@/components/Tag';
import * as utils from '@/utils/utils';
import * as msg from '@/hooks/web/msg';
import { PageWrapper } from '/@/components/Page';
import { TableAction } from '/@/components/Table';
import componentSetting from '/@/settings/componentSetting';
import { RelativeTime } from '@/components/RelativeTime';
import NoWrap from '@/components/NoWrap';
import CronPicker from '@/components/CronPicker';
import { defHttp } from '@/utils/http/axios';
import CustomList from '@/components/CustomList';
import CustomSelector from '@/components/CustomSelector';
import CustomPage from '@/components/CustomPage';
import OrderTimeLine from '@/components/OrderTimeLine';
import DataDicPicker from '@/components/DataDicPicker';

export async function registerGlobComp(app: App) {
  app
    .use(Antd)
    .use(VxeUI)
    .use(VXETable)
    .component('RelativeTime', RelativeTime)
    .component('JForm', JForm)
    .component('JFormItem', JFormItem)
    .component('JImgUpload', JImgUpload)
    .component('JBorder', JBorder)
    .component('DialogTable', DialogTable)
    .component('DialogTree', DialogTree)
    .component('Icon', Icon)
    .component('PageWrapper', PageWrapper)
    .component('TableAction', TableAction)
    .component('NoWrap', NoWrap)
    .component('CronPicker', CronPicker)
    .component('CustomList', CustomList)
    .component('CustomSelector', CustomSelector)
    .component('CustomPage', CustomPage)
    .component('OrderTimeLine', OrderTimeLine)
    .component('DataDicPicker', DataDicPicker);

  VxeUI.use(VxeUIPluginRenderAntd)
  VXETable.setup(componentSetting.vxeTable);
  VXETable.renderer.add('NotData', {
    // 空内容模板
    renderEmpty(renderOpts) {
      const { attrs, props } = renderOpts;
      return [
        h(Empty, {
          ...attrs,
          ...props,
        }),
      ];
    },
  });

  app.config.globalProperties.$utils = utils;
  app.config.globalProperties.$msg = msg;
  app.config.globalProperties.$defHttp = defHttp;

  await enumsInstall(app);
  await tagInstall(app);
  await selectorInstall(app);
  await importorInstall(app);
}
