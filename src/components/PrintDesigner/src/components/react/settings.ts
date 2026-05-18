import { CommonSettings } from '../CommonSettings';
import { defaultStyle, LodopStyle } from '@/components/PrintDesigner/src/constants/LodopStyle';
import { createPx2mmByPage } from '../../utils/calc';

export const widgetName: string = 'braid-react';

export interface ReactLodopStyle extends LodopStyle {
  /**
   * 线条类型，数字型，0--实线 1--破折线 2--点线 3--点划线 4--双点划线
   */
  intLineStyle: number;

  /**
   * 线条宽，整数型，单位是（打印）像素，缺省值是1，非实线的线条宽也是0。
   */
  intLineWidth: number;
}
export interface ReactWidgetSetting extends CommonSettings {
  style: ReactLodopStyle;
}

export const settings: ReactWidgetSetting = {
  type: widgetName,
  isEdit: false,
  draggable: true, // 是否可拖拽
  resizable: true, // 尺寸是否可变
  width: 120,
  height: 40,
  left: 50,
  top: 0,
  title: '矩形',
  name: '',
  style: {
    ...defaultStyle,
    zIndex: 0,
    intLineStyle: 0,
    intLineWidth: 1,
  },
};

export const parser = {
  parse(LODOP: any, printItem: ReactWidgetSetting) {
    const px2mm = createPx2mmByPage(printItem.pageInfo);
    LODOP.ADD_PRINT_RECT(
      px2mm.y(printItem.top) + 'mm',
      px2mm.x(printItem.left) + 'mm',
      px2mm.width(printItem.width) + 'mm',
      px2mm.height(printItem.height) + 'mm',
      printItem.style.intLineStyle,
      printItem.style.intLineWidth,
    );
  },
};
