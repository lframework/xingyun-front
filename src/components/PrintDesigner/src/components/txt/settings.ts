import { CommonSettings } from '../CommonSettings';
import { defaultStyle, LodopStyle } from '@/components/PrintDesigner/src/constants/LodopStyle';
import { px2mm } from '../../utils/calc';

export const widgetName: string = 'braid-txt';

export interface TxtWidgetStyle extends LodopStyle {
  /**
   * 是否显示边框
   */
  bordered: boolean;

  /**
   * 线条类型，数字型，0--实线 1--破折线 2--点线 3--点划线 4--双点划线
   */
  intLineStyle?: number;

  /**
   * 线条宽，整数型，单位是（打印）像素，缺省值是1，非实线的线条宽也是0。
   */
  intLineWidth?: number;

  /**
   * 文字距离上边框距离
   */
  topOffset?: number;

  /**
   * 文字距离左边框距离
   */
  leftOffset?: number;
}

export interface TxtWidgetSetting extends CommonSettings {
  value: string;
  style: TxtWidgetStyle;
}

export const settings: TxtWidgetSetting = {
  type: widgetName,
  isEdit: true,
  draggable: true, // 是否可拖拽
  resizable: true, // 尺寸是否可变
  width: 120,
  height: 40,
  left: 50,
  top: 0,
  title: '自定义文本',
  value: '自定义文本',
  name: '',
  style: {
    ...defaultStyle,
    FontSize: '9',
    FontColor: '#000000',
    Bold: '0', // 1代表粗体，0代表非粗体
    Italic: '0', // 1代表斜体，0代表非斜体
    Underline: '0', // 1代表有下划线，0代表无下划线
    Alignment: 'left', // 对齐方式
    ItemType: '0', // 打印类型 0--普通项 1--页眉页脚 2--页号项 3--页数项 4--多页项
    bordered: false, // 是否显示边框
    intLineStyle: 0,
    intLineWidth: 1,
    topOffset: 0,
    leftOffset: 0,
  },
};

export const parser = {
  parse(LODOP: object, printItem: TxtWidgetSetting) {
    if (printItem.style.bordered) {
      LODOP.ADD_PRINT_RECT(
        px2mm(printItem.top) + 'mm',
        px2mm(printItem.left) + 'mm',
        px2mm(printItem.width) + 'mm',
        px2mm(printItem.height) + 'mm',
        printItem.style.intLineStyle,
        printItem.style.intLineWidth,
      );

      LODOP.SET_PRINT_STYLEA(0, 'ItemType', printItem.style.ItemType);
    }
    LODOP.ADD_PRINT_TEXT(
      px2mm(printItem.top + (printItem.style.topOffset || 0)) + 'mm',
      px2mm(printItem.left + (printItem.style.leftOffset || 0)) + 'mm',
      px2mm(printItem.width) + 'mm',
      px2mm(printItem.height) + 'mm',
      printItem.value,
    );
  },
};
