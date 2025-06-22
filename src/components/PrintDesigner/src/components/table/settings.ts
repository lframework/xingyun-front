import { CommonSettings } from '../CommonSettings';
import { defaultStyle, LodopStyle } from '@/components/PrintDesigner/src/constants/LodopStyle';
import { px2mm, px2pt } from '../../utils/calc';
import { isEmpty } from '@/utils/utils';

export const widgetName: string = 'braid-table';

export interface TableLodopStyle extends LodopStyle {
  /**
   * 高度自动（模板在该元素位置以下的元素都关联打印）
   */
  autoHeight: boolean;

  /**
   * 距离下边距
   */
  BottomMargin: number;

  /**
   * 边框颜色
   */
  borderColor: string;
}

export interface TableWidgetSetting extends CommonSettings {
  value: any[];
  defaultValue: any[];
  columnsAttr: any[];
  columns: any[];
  selectCol: any[];
  style: TableLodopStyle;
}

export const settings: TableWidgetSetting = {
  type: widgetName,
  isEdit: false, // 是否可编辑
  draggable: true, // 是否可拖拽
  resizable: true, // 尺寸是否可变
  width: 240,
  height: 60,
  left: 50,
  top: 10,
  title: '表格',
  value: [],
  defaultValue: [],
  columnsAttr: [], // 表格列选项
  columns: [], // 已选表格列表
  selectCol: [], // 已选表格列name数组（用于多选框双向绑定）
  name: '',
  style: {
    ...defaultStyle,
    Alignment: 'left', // 对齐方式 1--左靠齐 2--居中 3--右靠齐
    FontSize: '9',
    FontColor: '#000000',
    borderColor: '#000000',
    autoHeight: false, // 高度自动（模板在该元素位置以下的元素都关联打印）
    BottomMargin: 0, // 距离下边距
  },
};

export const parser = {
  parse(LODOP: object, printItem: TableWidgetSetting) {
    const tableTempTohtml = (columns, data, style) => {
      // 验证输入参数
      if (!Array.isArray(columns)) {
        throw new Error("Invalid input: 'columns' must be an array.");
      }
      if (!Array.isArray(data)) {
        throw new Error("Invalid input: 'data' must be an array.");
      }

      // 定义默认样式
      const defaultStyle = {
        Alignment: 'left',
        FontSize: '12',
        FontColor: 'black',
        borderColor: '#000000',
      };

      // 合并用户提供的样式与默认样式
      const mergedStyle = { ...defaultStyle, ...style };

      // 生成样式字符串
      const generateStyleString = (styleObj) => {
        return Object.entries(styleObj)
          .filter(([key, value]) => value !== undefined && value !== null)
          .map(([key, value]) => `${key}:${value}`)
          .join(';');
      };

      const styleStr = generateStyleString({
        'text-align': mergedStyle.Alignment,
        'font-size': `${px2pt(mergedStyle.FontSize)}pt`,
        color: mergedStyle.FontColor,
      });

      // HTML 转义函数，防止 XSS 攻击
      const escapeHtml = (str) => {
        if (typeof str !== 'string') {
          str = String(str);
        }
        return str.replace(
          /[&<>"']/g,
          (match) =>
            ({
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#x27;',
            }[match] || match),
        );
      };

      let html =
        '<style> table td,table th {word-break: break-all;box-sizing:border-box;border:1px solid ' +
        escapeHtml(mergedStyle.borderColor) +
        ';' +
        styleStr +
        '}</style>';
      html += `<table border=1 width='100%' cellspacing='0' frame="box" cellpadding='2' style='border-collapse:collapse;'>`;

      // 解析表头
      html += '<thead><tr>';
      columns.forEach((column) => {
        if (column.name === '_seq') {
          html += '<th width="30">';
        } else {
          html += '<th>';
        }
        html += escapeHtml(column.title);
        html += '</th>';
      });
      html += '</tr></thead>';
      html += '<tbody>';

      // 解析内容
      if (data.length > 0) {
        data.forEach((item, idx) => {
          html += '<tr>';
          columns.forEach((column) => {
            if (column.name === '_seq') {
              html += `<td>${idx + 1}</td>`;
            } else {
              html += `<td>${escapeHtml(isEmpty(item[column.name]) ? '' : item[column.name])}</td>`;
            }
          });
          html += '</tr>';
        });
      } else {
        html += "<tr><td colspan='" + columns.length + "'>" + escapeHtml('暂无数据') + '</td></tr>';
      }

      html += '</tbody>';
      html += '</table>';
      return html;
    };

    const html = tableTempTohtml(
      printItem.columns ? printItem.columns : [],
      printItem.defaultValue,
      printItem.style,
    );
    if (printItem.style.autoHeight) {
      LODOP.ADD_PRINT_TABLE(
        px2mm(printItem.top) + 'mm',
        px2mm(printItem.left) + 'mm',
        px2mm(printItem.width) + 'mm',
        'BottomMargin:' + px2mm(printItem.style.BottomMargin) + 'mm',
        html,
      );
    } else {
      LODOP.ADD_PRINT_TABLE(
        px2mm(printItem.top) + 'mm',
        px2mm(printItem.left) + 'mm',
        px2mm(printItem.width) + 'mm',
        px2mm(printItem.height) + 'mm',
        html,
      );
    }
  },
};
