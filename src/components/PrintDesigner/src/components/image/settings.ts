import { CommonSettings } from '../CommonSettings';
import { defaultStyle, LodopStyle } from '@/components/PrintDesigner/src/constants/LodopStyle';
import { createPx2mmByPage } from '../../utils/calc';

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
  parse(LODOP: any, printItem: ImageWidgetSetting) {
    const px2mm = createPx2mmByPage(printItem.pageInfo);
    const imageTempTohtml = (value) => {
      const html = "<img style='width:100%' src='" + value + "'/>";

      return html;
    };

    const html = imageTempTohtml(printItem.value);
    LODOP.ADD_PRINT_IMAGE(
      px2mm.y(printItem.top) + 'mm',
      px2mm.x(printItem.left) + 'mm',
      px2mm.width(printItem.width) + 'mm',
      px2mm.height(printItem.height) + 'mm',
      html,
    );
  },
};
