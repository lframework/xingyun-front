// import braidPic from './pic/index.vue'
import braidTxt from './src/components/txt/index.vue';
import {
  settings as braidTxtSettings,
  widgetName as braidTxtName,
} from './src/components/txt/settings';
import barCode from './src/components/bar-code/index.vue';
import {
  settings as braidBarCodeSettings,
  widgetName as braidBarCodeName,
} from './src/components/bar-code/settings';
import table from './src/components/table/index.vue';
import {
  settings as braidTableSettings,
  widgetName as braidTableName,
} from './src/components/table/settings';
import image from './src/components/image/index.vue';
import {
  settings as braidImageSettings,
  widgetName as braidImageName,
} from './src/components/image/settings';
import html from './src/components/html/index.vue';
import {
  settings as braidHtmlSettings,
  widgetName as braidHtmlName,
} from './src/components/html/settings';
import react from './src/components/react/index.vue';
import {
  settings as braidReactSettings,
  widgetName as braidReactName,
} from './src/components/react/settings';
import page from './src/components/page/index.vue';
import {
  settings as braidPageSettings,
  widgetName as braidPageName,
} from './src/components/page/settings';

import BarCodePanel from './src/components/bar-code/panel.vue';
import HtmlPanel from './src/components/html/panel.vue';
import ImagePanel from './src/components/image/panel.vue';
import TxtPanel from './src/components/txt/panel.vue';
import TablePanel from './src/components/table/panel.vue';
import ReactPanel from './src/components/react/panel.vue';
import PagePanel from './src/components/page/panel.vue';

const install = function (Vue) {
  Vue.component(braidTxtName, braidTxt);
  Vue.component(braidBarCodeName, barCode);
  Vue.component(braidTableName, table);
  Vue.component(braidImageName, image);
  Vue.component(braidHtmlName, html);
  Vue.component(braidReactName, react);
  Vue.component(braidPageName, page);
  Vue.component(braidBarCodeName + 'Panel', BarCodePanel);
  Vue.component(braidHtmlName + 'Panel', HtmlPanel);
  Vue.component(braidImageName + 'Panel', ImagePanel);
  Vue.component(braidTxtName + 'Panel', TxtPanel);
  Vue.component(braidTableName + 'Panel', TablePanel);
  Vue.component(braidReactName + 'Panel', ReactPanel);
  Vue.component(braidPageName + 'Panel', PagePanel);
};

const getWidgetsSetting = function () {
  return {
    [braidTxtName]: braidTxtSettings,
    [braidBarCodeName]: braidBarCodeSettings,
    [braidTableName]: braidTableSettings,
    [braidImageName]: braidImageSettings,
    [braidHtmlName]: braidHtmlSettings,
    [braidReactName]: braidReactSettings,
    [braidPageName]: braidPageSettings,
  };
};
export default {
  install,
  getWidgetsSetting,
};
