import { CommonSettings } from '../CommonSettings';
import { defaultStyle, LodopStyle } from '@/components/PrintDesigner/src/constants/LodopStyle';
import { px2mm } from '../../utils/calc';

export const widgetName: string = 'braid-image';

export interface ImageLodopStyle extends LodopStyle {}
export interface ImageWidgetSetting extends CommonSettings {
  value: string;
  defaultValue: string;
  style: ImageLodopStyle;
}

export const settings: ImageWidgetSetting = {
  type: widgetName,
  title: '图片',
  isEdit: false,
  draggable: true, // 是否可拖拽
  resizable: true, // 尺寸是否可变
  width: 120,
  height: 40,
  left: 50,
  top: 0,
  value: '',
  defaultValue: '',
  name: '',
  style: {
    ...defaultStyle,
    ItemType: '0', // 打印类型 0--普通项 1--页眉页脚 2--页号项 3--页数项 4--多页项
  },
};

export const parser = {
  parse(LODOP: object, printItem: ImageWidgetSetting) {
    const imageTempTohtml = (value) => {
      const html = "<img style='width:100%' src='" + value + "'/>";

      return html;
    };

    const html = imageTempTohtml(printItem.value);
    LODOP.ADD_PRINT_IMAGE(
      px2mm(printItem.top) + 'mm',
      px2mm(printItem.left) + 'mm',
      px2mm(printItem.width) + 'mm',
      px2mm(printItem.height) + 'mm',
      html,
    );
  },
};
