import { CommonSettings } from '../CommonSettings';
import { defaultStyle, LodopStyle } from '@/components/PrintDesigner/src/constants/LodopStyle';
import { px2mm, px2pt } from '../../utils/calc';

export const widgetName: string = 'braid-html';

export interface HtmlLodopStyle extends LodopStyle {
  /**
   * 高度自动（模板在该元素位置以下的元素都关联打印）
   */
  autoHeight: boolean;

  /**
   * 距离下边距
   */
  BottomMargin: number;
}
export interface HtmlWidgetSetting extends CommonSettings {
  value: string;
  defaultValue: string;
  style: HtmlLodopStyle;
}

export const settings: HtmlWidgetSetting = {
  type: widgetName,
  isEdit: false,
  draggable: true, // 是否可拖拽
  resizable: true, // 尺寸是否可变
  width: 120,
  height: 40,
  left: 50,
  top: 0,
  title: 'html',
  value: '<div>html<div>',
  defaultValue: '<div>html<div>',
  name: '',
  style: {
    ...defaultStyle,
    ItemType: '0', // 打印类型 0--普通项 1--页眉页脚 2--页号项 3--页数项 4--多页项
    autoHeight: false, // 高度自动（模板在该元素位置以下的元素都关联打印）
    BottomMargin: 0, // 距离下边距
  },
};

export const parser = {
  parse(LODOP: object, printItem: HtmlWidgetSetting) {
    const htmlTempTohtml = (val, style) => {
      let styleStr = 'text-align:' + style.Alignment + ';';
      styleStr += 'font-size:' + px2pt(style.FontSize) + 'pt;';
      styleStr += 'color:' + style.FontColor + ';';
      let html = "<span style='" + styleStr + "'>";
      html += val;
      html += '</span>';
      return html;
    };

    const html = htmlTempTohtml(printItem.defaultValue, printItem.style);
    if (printItem.style.autoHeight) {
      LODOP.ADD_PRINT_HTM(
        px2mm(printItem.top) + 'mm',
        px2mm(printItem.left) + 'mm',
        px2mm(printItem.width) + 'mm',
        'BottomMargin:' + px2mm(printItem.style.BottomMargin) + 'mm',
        html,
      );
    } else {
      LODOP.ADD_PRINT_HTM(
        px2mm(printItem.top) + 'mm',
        px2mm(printItem.left) + 'mm',
        px2mm(printItem.width) + 'mm',
        px2mm(printItem.height) + 'mm',
        html,
      );
    }
  },
};
