import { CommonSettings } from '../CommonSettings';
import { LodopStyle, defaultStyle } from '@/components/PrintDesigner/src/constants/LodopStyle';
import { px2mm } from '../../utils/calc';

export const widgetName: string = 'braid-barcode';

export interface BarCodeLodopStyle extends LodopStyle {
  /**
   * 条码类型，字符型。目前支持的类型（条码规制）如下：
   * 128A，128B，128C，128Auto，EAN8，EAN13，EAN128A，EAN128B，EAN128C，Code39，39Extended，2_5interleaved，2_5industrial，2_5matrix，UPC_A，UPC_E0，UPC_E1，UPCsupp2，UPCsupp5，Code93，93Extended，MSI，PostNet，Codabar，QRCode，PDF417。
   * 其中QRCode和PDF417是二维码，其它为一维码。默认情况下“QRCode的版本”、“PDF417压缩模式”、“PDF417容错级别” “PDF417数据列数” “PDF417基条高(倍数)”等参数会根据宽度和高度自动调整，当然页面程序也可以直接设置它们的具体值。
   */
  CodeType: string;
}

export interface BarCodeWidgetSetting extends CommonSettings {
  style: BarCodeLodopStyle;
}

export const settings: BarCodeWidgetSetting = {
  type: widgetName,
  isEdit: false,
  draggable: true, // 是否可拖拽
  resizable: true, // 尺寸是否可变
  width: 200,
  height: 40,
  left: 50,
  top: 0,
  title: '条码',
  name: '',
  style: {
    ...defaultStyle,
    FontSize: '9',
    ShowBarText: '0', // 条码是否显示值 0--不显示 1--显示
    CodeType: 'Code39', // 条码类型
    ItemType: '0', // 打印类型 0--普通项 1--页眉页脚 2--页号项 3--页数项 4--多页项
  },
};

export const parser = {
  parse(LODOP: object, printItem: BarCodeWidgetSetting) {
    LODOP.ADD_PRINT_BARCODE(
      px2mm(printItem.top) + 'mm',
      px2mm(printItem.left) + 'mm',
      px2mm(printItem.width) + 'mm',
      px2mm(printItem.height) + 'mm',
      printItem.style.CodeType,
      printItem.value,
    );
  },
};
