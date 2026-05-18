import { CommonSettings } from '../CommonSettings';
import { defaultStyle, LodopStyle } from '@/components/PrintDesigner/src/constants/LodopStyle';
import { createPx2mmByPage, px2pt } from '../../utils/calc';

export const widgetName: string = 'braid-page';

export interface PageLodopStyle extends LodopStyle {
  /**
   * 高度自动（模板在该元素位置以下的元素都关联打印）
   */
  autoHeight: boolean;

  /**
   * 距离下边距
   */
  BottomMargin: number;
}
export interface PageWidgetSetting extends CommonSettings {
  curPageStyle: string;
  splitPageStyle: string;
  totalPageStyle: string;
  style: PageLodopStyle;
}

export const settings: PageWidgetSetting = {
  type: widgetName,
  isEdit: false,
  draggable: true, // 是否可拖拽
  resizable: true, // 尺寸是否可变
  width: 120,
  height: 40,
  left: 50,
  top: 0,
  title: '分页',
  curPageStyle: '第##页',
  splitPageStyle: '/',
  totalPageStyle: '共##页',
  name: '',
  style: {
    ...defaultStyle,
    ItemType: '1', // 打印类型 0--普通项 1--页眉页脚 2--页号项 3--页数项 4--多页项
    autoHeight: false, // 高度自动（模板在该元素位置以下的元素都关联打印）
    BottomMargin: 0, // 距离下边距
    Alignment: 'left',
    FontSize: '9',
    FontColor: '#000000',
  },
};

export const parser = {
  parse(LODOP: any, printItem: PageWidgetSetting) {
    const px2mm = createPx2mmByPage(printItem.pageInfo);
    const htmlTempTohtml = (style) => {
      let styleStr = 'text-align:' + style.Alignment + ';';
      styleStr += 'font-size:' + px2pt(style.FontSize) + 'pt;';
      styleStr += 'color:' + style.FontColor + ';';
      let html = "<div style='" + styleStr + "'>";
      html += `<font><span tdata='pageNO'>${printItem.curPageStyle}</span>${printItem.splitPageStyle}<span tdata='pageCount'>${printItem.totalPageStyle}</span></font>`;
      html += '</div>';
      return html;
    };

    const html = htmlTempTohtml(printItem.style);
    if (printItem.style.autoHeight) {
      LODOP.ADD_PRINT_HTM(
        px2mm.y(printItem.top) + 'mm',
        px2mm.x(printItem.left) + 'mm',
        px2mm.width(printItem.width) + 'mm',
        'BottomMargin:' + px2mm.height(printItem.style.BottomMargin) + 'mm',
        html,
      );
    } else {
      LODOP.ADD_PRINT_HTM(
        px2mm.y(printItem.top) + 'mm',
        px2mm.x(printItem.left) + 'mm',
        px2mm.width(printItem.width) + 'mm',
        px2mm.height(printItem.height) + 'mm',
        html,
      );
    }
  },
};
