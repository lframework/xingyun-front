import { getLodop } from './LodopFuncs';
import cloneDeep from 'lodash/cloneDeep';
import { strTempToValue } from './tools';
import { parser as barCodeParser } from '../../components/bar-code/settings';
import { parser as htmlParser } from '../../components/html/settings';
import { parser as imageParser } from '../../components/image/settings';
import { parser as txtParser } from '../../components/txt/settings';
import { parser as tableParser } from '../../components/table/settings';
import { parser as reactParser } from '../../components/react/settings';
import { parser as pageParser } from '../../components/page/settings';
import { px2pt } from '../../utils/calc';

export default { print, preview, previewTemp };

/**
 * 打印功能
 * @param {*Object} temp 打印模板
 * @param {*Array} data 打印数据
 */
function print(temp, data) {
  let LODOP = _CreateLodop(
    temp.title,
    temp.pageDirection,
    temp.width,
    temp.height,
    temp.pageWidth,
    temp.pageHeight,
  );
  let tempItems = cloneDeep(temp.tempItems);
  let printContent = _TempParser(tempItems, data);
  if (printContent.length > 1) {
    // 打印多份
    printContent.forEach((aPrint, index) => {
      LODOP.NewPageA();
      aPrint.forEach((printItem) => {
        _AddPrintItem(LODOP, printItem, index);
      });
    });
  } else {
    // 单份
    printContent[0].forEach((printItem) => {
      _AddPrintItem(LODOP, printItem);
    });
  }

  let flag = LODOP.PRINT();
  return flag;
}

/**
 * 打印预览功能
 * @param {*Object} temp 打印模板
 * @param {*Array} data 打印数据
 */
function preview(temp, data) {
  let LODOP = _CreateLodop(
    temp.title,
    temp.pageDirection,
    temp.width,
    temp.height,
    temp.pageWidth,
    temp.pageHeight,
  );
  let tempItems = cloneDeep(temp.tempItems);
  let printContent = _TempParser(tempItems, data);
  if (data.length > 1) {
    // 打印多份
    printContent.forEach((aPrint, index) => {
      LODOP.NewPageA();
      aPrint.forEach((printItem) => {
        _AddPrintItem(LODOP, printItem, index);
      });
    });
  } else {
    // 单份
    printContent[0].forEach((printItem) => {
      _AddPrintItem(LODOP, printItem);
    });
  }

  let flag = LODOP.PREVIEW();
  return flag;
}

/**
 * 模板预览功能
 * @param {*Object} temp 打印模板
 */
function previewTemp(temp) {
  let LODOP = _CreateLodop(
    temp.title,
    temp.pageDirection,
    temp.width,
    temp.height,
    temp.pageWidth,
    temp.pageHeight,
  );

  let printContent = _TempParser(temp.tempItems);
  printContent[0].forEach((printItem) => {
    _AddPrintItem(LODOP, printItem);
  });
  let flag = LODOP.PREVIEW();
  return flag;
}

/**
 * LODOP 根据属性创建打印
 * @param pageName 纸张名称
 * @param pageDirection 纸张方向
 * @param width 可视区域宽度(单位px)
 * @param height 可视区域高度(单位px)
 * @param pageWidth 纸张宽度(mm)
 * @param pageHeight 纸张高度(mm)
 * @param top 可视区域上边距(单位px)
 * @param left 可视区域左边距(单位px)
 */
function _CreateLodop(
  pageName,
  pageDirection,
  width,
  height,
  pageWidth = 0,
  pageHeight = 0,
  top = 0,
  left = 0,
) {
  let LODOP = getLodop();

  // console.log(strCompanyName, strLicense, strLicenseA, strLicenseB)

  // 设置软件产品注册信息
  // LODOP.SET_LICENSES(strCompanyName, strLicense, strLicenseA, strLicenseB);

  LODOP.PRINT_INITA(top, left, width, height, pageName);
  LODOP.SET_PRINT_PAGESIZE(
    pageDirection,
    pageWidth ? pageWidth + 'mm' : 0,
    pageHeight ? pageHeight + 'mm' : 0,
    '',
  );

  return LODOP;
}

/**
 * 解析模板和数据生成打印项
 * @param {*Array} tempItem 模板打赢项
 * @param {Array} data 打印数据,
 * @return {Array} 若data为null则返回处理后的模板
 */
function _TempParser(tempItem, data) {
  let temp = cloneDeep(tempItem);
  //修改模板答应项顺序
  //将自适应高度的打印项（item.style.autoHeight == true）放在第一项
  let flag = temp.findIndex((item) => item.style.autoHeight);
  if (flag != -1) {
    let autoItem = temp[flag];
    temp.splice(flag, 1);
    temp.unshift(autoItem);
    // 处理位于自适应打印项下方的打印项
    temp.forEach((item) => {
      // 位于自适应高度项下的打印项修改top、left,并添加关联属性（style.LinkedItem）
      if (item.top > autoItem.top && item.style.ItemType == 0) {
        item.top = item.top - autoItem.top - autoItem.height;
        item.left = item.left - autoItem.left;
        item.style.LinkedItem = 1;
      }
    });
  }

  if (data && data.length > 0) {
    // 解析打印模板和数据，生成生成打印内容
    let tempContent = [];
    data.forEach((dataItem) => {
      let conItem = temp.map((tempItem) => {
        let item = cloneDeep(tempItem);
        if (item.name) {
          item.defaultValue = dataItem[item.name];
          item.value = strTempToValue(item.value, item.defaultValue);
        }
        return item;
      });
      tempContent.push(conItem);
    });
    return tempContent;
  } else {
    return [temp];
  }
}

/**
 * 添加打印项
 * @param {lodop} LODOP 打印实例
 * @param {Object} printItem 打印项内容
 * @param {Number} pageIndex 当前打印页的开始序号
 */
function _AddPrintItem(LODOP, tempItem, pageIndex = 0) {
  let printItem = cloneDeep(tempItem);
  // TempItemStyle转换为LodopItemStyle
  let lodopStyle = _createLodopStyle(printItem.style);

  // 批量打印时，修改关联打印项的关联序号
  if (lodopStyle.LinkedItem == 1) {
    lodopStyle.LinkedItem = 1 + pageIndex;
  }
  // 添加打印项
  switch (printItem.type) {
    case 'braid-txt':
      txtParser.parse(LODOP, printItem);
      break;
    case 'braid-barcode':
      barCodeParser.parse(LODOP, printItem);
      break;
    case 'braid-html':
      htmlParser.parse(LODOP, printItem);
      break;
    case 'braid-table':
      tableParser.parse(LODOP, printItem);
      break;
    case 'braid-image':
      imageParser.parse(LODOP, printItem);
      break;
    case 'braid-react':
      reactParser.parse(LODOP, printItem);
      break;
    case 'braid-page':
      pageParser.parse(LODOP, printItem);
      break;
    default:
      '';
  }
  // 设置打印项样式
  Object.keys(lodopStyle).forEach((key) => {
    switch (key) {
      case 'FontSize': {
        LODOP.SET_PRINT_STYLEA(0, key, px2pt(lodopStyle[key]));
        break;
      }

      default: {
        LODOP.SET_PRINT_STYLEA(0, key, lodopStyle[key]);
      }
    }
  });
  // 设置默认LodopStyle
  let defaultLodopStyle = printItem.lodopStyle;
  if (defaultLodopStyle) {
    Object.keys(defaultLodopStyle).forEach((key) => {
      LODOP.SET_PRINT_STYLEA(0, key, defaultLodopStyle[key]);
    });
  }
}

/**
 * 将模板设计样式转换为lodop样式
 * @param style 模板样式
 * @returns lodop样式对象
 */
function _createLodopStyle(style) {
  let lodopStyle = {
    zIndex: style.zIndex,
  };

  for (let key in style) {
    if (['bold', 'italic', 'underline', 'ShowBarText'].indexOf(key) > -1) {
      lodopStyle[key] = style[key] ? 1 : 0;
    } else if (key === 'Alignment') {
      lodopStyle[key] = style[key] == 'left' ? 1 : style[key] == 'center' ? 2 : 3;
    } else {
      lodopStyle[key] = style[key];
    }
  }

  return lodopStyle;
}
