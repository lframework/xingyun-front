import { defineStore } from 'pinia';
import { getDefaultProps } from '../libs/props.js';
import printComponents from '../../install';

const generate = () => {
  const s = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01

  const uuid = s.join('');
  return uuid;
};

export const usePrintDesignerStore = defineStore({
  id: 'print-designer-store',
  state: () => ({
    zoom: 100, // 画布缩放百分比
    type: 'page', // 选中元素类型
    index: -1, // 选中元素索引
    uuid: -1, // 选中元素uuid

    originX: 0, // 选中元件的横向初始值
    originY: 0, // 选中元件的纵向初始值
    startX: 0, // 鼠标摁下时的横坐标
    startY: 0, // 鼠标摁下时的纵坐标
    moving: false, // 是否正在移动元件（参考线仅在移动元件时显示）

    activeElement: getDefaultProps(), // 选中对象，要么是元件，要么是页面

    // 模板信息
    page: {
      title: 'demo',
      width: 750,
      height: 550,
      pageWidth: 750,
      pageHeight: 550,
      tempItems: [], // 模板已选项
    },
    optionItems: [], // 可选项

    //模板参数
    tempId: '', // 模板Id
    loading: false, // 是否正在初始化中

    widgetSetting: printComponents.getWidgetsSetting(), // 模板组件默认属性
  }),

  actions: {
    // 添加模板项
    addTempItem(item) {
      const def = { uuid: generate(), top: 0, left: 0 };
      const setting = JSON.parse(JSON.stringify(item));

      this.page.tempItems.push(Object.assign(setting, def));
      // 设置选中
      this.select({
        uuid: this.page.tempItems[this.page.tempItems.length - 1].uuid,
      });
    },

    // 初始化模板设计器
    async designerInit(tempInfo) {
      this.initOptionItems(tempInfo.options);
      this.initPage(tempInfo.tempValue);
    },

    // 初始化页面属性
    initPage(pageInfo) {
      this.page = pageInfo;
      // 补全默认样式
      const tempItems = pageInfo.tempItems
        ? pageInfo.tempItems.map((item) => {
            const optionItem = {
              ...this.widgetSetting[item.type],
              ...item,
              style: { ...this.widgetSetting[item.type].style, ...(item.style || {}) },
            };
            return optionItem;
          })
        : [];

      this.page.tempItems = tempItems;
    },
    // 初始化可选对象
    initOptionItems(options) {
      // 补全默认属性
      const optionsObject = options
        ? options.map((item) => {
            const optionItem = {
              ...this.widgetSetting[item.type],
              ...item,
              style: { ...this.widgetSetting[item.type].style, ...(item.style || {}) },
            };
            return optionItem;
          })
        : [];

      this.optionItems = optionsObject;
    },

    // 初始化选中对象
    initActive() {
      this.activeElement = getDefaultProps();
    },

    // 设置 mousemove 操作的初始值
    initmove(payload) {
      this.startX = payload.startX;
      this.startY = payload.startY;
      this.originX = payload.originX;
      this.originY = payload.originY;
      this.moving = true;
    },

    // 选中元件与取消选中
    select(temp) {
      this.uuid = temp.uuid;
      if (temp.uuid === -1) {
        this.activeElement = getDefaultProps();
        this.type = 'page';
      } else {
        const widget = this.page.tempItems.find((w) => w.uuid === temp.uuid);
        if (widget) {
          this.activeElement = widget;
          this.type = widget.type;
        }
      }
    },

    // 元件移动结束
    stopmove() {
      this.moving = false;
    },

    // 移动元件
    move(track) {
      const target = this.activeElement;
      const dx = track.x - this.startX;
      const dy = track.y - this.startY;
      const left = this.originX + Math.floor((dx * 100) / this.zoom);
      const top = this.originY + Math.floor((dy * 100) / this.zoom);

      target.left = left > 0 ? left : 0;
      target.top = top > 0 ? top : 0;
    },

    // 调整元件尺寸
    resize(track) {
      const dx = track.x - this.startX;
      const dy = track.y - this.startY;
      let value;

      if (track.type === 'right') {
        value = this.originX + Math.floor((dx * 100) / this.zoom);
        this.activeElement.width = value > 10 ? value : 10;
        return;
      }

      if (track.type === 'down') {
        value = this.originX + Math.floor((dy * 100) / this.zoom);
        this.activeElement.height = value > 10 ? value : 10;
        return;
      }

      if (track.type === 'left') {
        const left = this.originX + Math.floor((dx * 100) / this.zoom);
        const width = this.originY - Math.floor((dx * 100) / this.zoom);
        this.activeElement.left = left > 0 ? left : 0;
        this.activeElement.width = width > 10 ? width : 10;
        return;
      }

      if (track.type === 'up') {
        const top = this.originX + Math.floor((dy * 100) / this.zoom);
        const height = this.originY - Math.floor((dy * 100) / this.zoom);
        this.activeElement.top = top > 0 ? top : 0;
        this.activeElement.height = height > 10 ? height : 10;
      }
    },

    // 更新元件初始 top 值
    updateSrollTop(top) {
      this.top = top;
    },

    // 删除选中元件
    delete(uuid) {
      const type = this.type;
      if (type === 'page') return;
      let index = 0;
      this.page.tempItems.forEach((item, idx) => {
        if (item.uuid === uuid) {
          index = idx;
        }
      });
      // 删除元件
      this.page.tempItems.splice(index, 1);

      // 重置 activeElement
      this.activeElement = getDefaultProps();
      this.type = 'page';
      this.uuid = -1;
    },

    // 更新数据
    updateData({ uuid, value }) {
      const widget = this.page.tempItems.find((w) => w.uuid === uuid);
      widget ? (widget.value = value) : '';
    },

    // 设置模板Id
    setTempId(id) {
      this.tempId = id;
    },

    setLoading(flag) {
      this.loading = flag;
    },
    // 设置模板默认属性
    setWidgetSetting(settingObj) {
      this.widgetSetting = settingObj;
    },
  },
});
