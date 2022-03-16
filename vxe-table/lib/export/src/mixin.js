"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.handlePrint = handlePrint;
exports.readLocalFile = readLocalFile;
exports.saveLocalFile = saveLocalFile;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _vXETable = _interopRequireDefault(require("../../v-x-e-table"));

var _utils = _interopRequireDefault(require("../../tools/utils"));

var _util = require("../../table/src/util");

var _dom = require("../../tools/dom");

var _log = require("../../tools/log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var formatText = _utils.default.formatText; // 默认导出或打印的 HTML 样式

var defaultHtmlStyle = 'body{margin:0;color:#333333;font-size:14px;font-family:"Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu}body *{-webkit-box-sizing:border-box;box-sizing:border-box}.vxe-table{border-collapse:collapse;text-align:left;border-spacing:0}.vxe-table:not(.is--print){table-layout:fixed}.vxe-table,.vxe-table th,.vxe-table td,.vxe-table td{border-color:#D0D0D0;border-style:solid;border-width:0}.vxe-table.is--print{width:100%}.border--default,.border--full,.border--outer{border-top-width:1px}.border--default,.border--full,.border--outer{border-left-width:1px}.border--outer,.border--default th,.border--default td,.border--full th,.border--full td,.border--outer th,.border--inner th,.border--inner td{border-bottom-width:1px}.border--default,.border--outer,.border--full th,.border--full td{border-right-width:1px}.border--default th,.border--full th,.border--outer th{background-color:#f8f8f9}.vxe-table td>div,.vxe-table th>div{padding:.5em .4em}.col--center{text-align:center}.col--right{text-align:right}.vxe-table:not(.is--print) .col--ellipsis>div{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;word-break:break-all}.vxe-table--tree-node{text-align:left}.vxe-table--tree-node-wrapper{position:relative}.vxe-table--tree-icon-wrapper{position:absolute;top:50%;width:1em;height:1em;text-align:center;-webkit-transform:translateY(-50%);transform:translateY(-50%);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer}.vxe-table--tree-unfold-icon,.vxe-table--tree-fold-icon{position:absolute;width:0;height:0;border-style:solid;border-width:.5em;border-right-color:transparent;border-bottom-color:transparent}.vxe-table--tree-unfold-icon{left:.3em;top:0;border-left-color:#939599;border-top-color:transparent}.vxe-table--tree-fold-icon{left:0;top:.3em;border-left-color:transparent;border-top-color:#939599}.vxe-table--tree-cell{display:block;padding-left:1.5em}.vxe-table input[type="checkbox"]{margin:0}.vxe-table input[type="checkbox"],.vxe-table input[type="radio"],.vxe-table input[type="checkbox"]+span,.vxe-table input[type="radio"]+span{vertical-align:middle;padding-left:0.4em}';
var htmlCellElem; // 导入

var fileForm;
var fileInput; // 打印

var printFrame;
var csvBOM = "\uFEFF";
var enterSymbol = '\r\n';

function createFrame() {
  var frame = document.createElement('iframe');
  frame.className = 'vxe-table--print-frame';
  return frame;
}

function getExportBlobByContent(content, options) {
  if (window.Blob) {
    return new Blob([content], {
      type: "text/".concat(options.type, ";charset=utf-8;")
    });
  }

  return null;
}

function hasTreeChildren($xetable, row) {
  var treeOpts = $xetable.treeOpts;
  return row[treeOpts.children] && row[treeOpts.children].length > 0;
}

function getSeq($xetable, row, $rowIndex, column, $columnIndex) {
  var seqOpts = $xetable.seqOpts;
  var seqMethod = seqOpts.seqMethod || column.seqMethod;

  if (seqMethod) {
    return seqMethod({
      row: row,
      rowIndex: $xetable.getRowIndex(row),
      $rowIndex: $rowIndex,
      column: column,
      columnIndex: $xetable.getColumnIndex(column),
      $columnIndex: $columnIndex
    });
  }

  return $xetable.getRowSeq(row);
}

function defaultFilterExportColumn(column) {
  return column.property || ['seq', 'checkbox', 'radio'].indexOf(column.type) > -1;
}

function toTableBorder(border) {
  if (border === true) {
    return 'full';
  }

  if (border) {
    return border;
  }

  return 'default';
}

function toBooleanValue(cellValue) {
  return _xeUtils.default.isBoolean(cellValue) ? cellValue ? 'TRUE' : 'FALSE' : cellValue;
}

function getLabelData($xetable, opts, columns, datas) {
  var isAllExpand = opts.isAllExpand,
      mode = opts.mode;
  var treeConfig = $xetable.treeConfig,
      treeOpts = $xetable.treeOpts,
      radioOpts = $xetable.radioOpts,
      checkboxOpts = $xetable.checkboxOpts;

  if (!htmlCellElem) {
    htmlCellElem = document.createElement('div');
  }

  if (treeConfig) {
    // 如果是树表格只允许导出数据源
    var rest = [];
    var expandMaps = new Map();

    _xeUtils.default.eachTree(datas, function (item, $rowIndex, items, path, parent, nodes) {
      var row = item._row || item;
      var parentRow = parent && parent._row ? parent._row : parent;

      if (isAllExpand || !parentRow || expandMaps.has(parentRow) && $xetable.isTreeExpandByRow(parentRow)) {
        var hasRowChild = hasTreeChildren($xetable, row);
        var _item = {
          _row: row,
          _level: nodes.length - 1,
          _hasChild: hasRowChild,
          _expand: hasRowChild && $xetable.isTreeExpandByRow(row)
        };
        columns.forEach(function (column, $columnIndex) {
          var cellValue = '';
          var renderOpts = column.editRender || column.cellRender;
          var exportLabelMethod = column.exportMethod;

          if (!exportLabelMethod && renderOpts && renderOpts.name) {
            var compConf = _vXETable.default.renderer.get(renderOpts.name);

            if (compConf) {
              exportLabelMethod = compConf.exportMethod || compConf.cellExportMethod;
            }
          }

          if (exportLabelMethod) {
            cellValue = exportLabelMethod({
              $table: $xetable,
              row: row,
              column: column,
              options: opts
            });
          } else {
            switch (column.type) {
              case 'seq':
                cellValue = mode === 'all' ? path.map(function (num, i) {
                  return i % 2 === 0 ? Number(num) + 1 : '.';
                }).join('') : getSeq($xetable, row, $rowIndex, column, $columnIndex);
                break;

              case 'checkbox':
                cellValue = toBooleanValue($xetable.isCheckedByCheckboxRow(row));
                _item._checkboxLabel = checkboxOpts.labelField ? _xeUtils.default.get(row, checkboxOpts.labelField) : '';
                _item._checkboxDisabled = checkboxOpts.checkMethod && !checkboxOpts.checkMethod({
                  row: row
                });
                break;

              case 'radio':
                cellValue = toBooleanValue($xetable.isCheckedByRadioRow(row));
                _item._radioLabel = radioOpts.labelField ? _xeUtils.default.get(row, radioOpts.labelField) : '';
                _item._radioDisabled = radioOpts.checkMethod && !radioOpts.checkMethod({
                  row: row
                });
                break;

              default:
                if (opts.original) {
                  cellValue = _utils.default.getCellValue(row, column);
                } else {
                  cellValue = $xetable.getCellLabel(row, column);

                  if (column.type === 'html') {
                    htmlCellElem.innerHTML = cellValue;
                    cellValue = htmlCellElem.innerText.trim();
                  } else {
                    var cell = $xetable.getCell(row, column);

                    if (cell) {
                      cellValue = cell.innerText.trim();
                    }
                  }
                }

            }
          }

          _item[column.id] = _xeUtils.default.toValueString(cellValue);
        });
        expandMaps.set(row, 1);
        rest.push(Object.assign(_item, row));
      }
    }, treeOpts);

    return rest;
  }

  return datas.map(function (row, $rowIndex) {
    var item = {
      _row: row
    };
    columns.forEach(function (column, $columnIndex) {
      var cellValue = '';
      var renderOpts = column.editRender || column.cellRender;
      var exportLabelMethod = column.exportMethod;

      if (!exportLabelMethod && renderOpts && renderOpts.name) {
        var compConf = _vXETable.default.renderer.get(renderOpts.name);

        if (compConf) {
          exportLabelMethod = compConf.exportMethod || compConf.cellExportMethod;
        }
      }

      if (exportLabelMethod) {
        cellValue = exportLabelMethod({
          $table: $xetable,
          row: row,
          column: column,
          options: opts
        });
      } else {
        switch (column.type) {
          case 'seq':
            cellValue = mode === 'all' ? $rowIndex + 1 : getSeq($xetable, row, $rowIndex, column, $columnIndex);
            break;

          case 'checkbox':
            cellValue = toBooleanValue($xetable.isCheckedByCheckboxRow(row));
            item._checkboxLabel = checkboxOpts.labelField ? _xeUtils.default.get(row, checkboxOpts.labelField) : '';
            item._checkboxDisabled = checkboxOpts.checkMethod && !checkboxOpts.checkMethod({
              row: row
            });
            break;

          case 'radio':
            cellValue = toBooleanValue($xetable.isCheckedByRadioRow(row));
            item._radioLabel = radioOpts.labelField ? _xeUtils.default.get(row, radioOpts.labelField) : '';
            item._radioDisabled = radioOpts.checkMethod && !radioOpts.checkMethod({
              row: row
            });
            break;

          default:
            if (opts.original) {
              cellValue = _utils.default.getCellValue(row, column);
            } else {
              cellValue = $xetable.getCellLabel(row, column);

              if (column.type === 'html') {
                htmlCellElem.innerHTML = cellValue;
                cellValue = htmlCellElem.innerText.trim();
              } else {
                var cell = $xetable.getCell(row, column);

                if (cell) {
                  cellValue = cell.innerText.trim();
                }
              }
            }

        }
      }

      item[column.id] = _xeUtils.default.toValueString(cellValue);
    });
    return item;
  });
}

function getExportData($xetable, opts) {
  var columns = opts.columns,
      dataFilterMethod = opts.dataFilterMethod;
  var datas = opts.data;

  if (dataFilterMethod) {
    datas = datas.filter(function (row, index) {
      return dataFilterMethod({
        row: row,
        $rowIndex: index
      });
    });
  }

  return getLabelData($xetable, opts, columns, datas);
}

function getBooleanValue(cellValue) {
  return cellValue === 'TRUE' || cellValue === 'true' || cellValue === true;
}

function getHeaderTitle(opts, column) {
  return (opts.original ? column.property : column.getTitle()) || '';
}

function getFooterCellValue($xetable, opts, items, column) {
  var renderOpts = column.editRender || column.cellRender;
  var exportLabelMethod = column.footerExportMethod;

  if (!exportLabelMethod && renderOpts && renderOpts.name) {
    var compConf = _vXETable.default.renderer.get(renderOpts.name);

    if (compConf) {
      exportLabelMethod = compConf.footerExportMethod || compConf.footerCellExportMethod;
    }
  }

  var _columnIndex = $xetable.getVTColumnIndex(column);

  var cellValue = exportLabelMethod ? exportLabelMethod({
    $table: $xetable,
    items: items,
    itemIndex: _columnIndex,
    _columnIndex: _columnIndex,
    column: column,
    options: opts
  }) : _xeUtils.default.toValueString(items[_columnIndex]);
  return cellValue;
}

function getFooterData(opts, footerTableData) {
  var footerFilterMethod = opts.footerFilterMethod;
  return footerFilterMethod ? footerTableData.filter(function (items, index) {
    return footerFilterMethod({
      items: items,
      $rowIndex: index
    });
  }) : footerTableData;
}

function getCsvCellTypeLabel(column, cellValue) {
  if (cellValue) {
    if (column.type === 'seq') {
      return "\t".concat(cellValue);
    }

    switch (column.cellType) {
      case 'string':
        if (!isNaN(cellValue)) {
          return "\t".concat(cellValue);
        }

        break;

      case 'number':
        break;

      default:
        if (cellValue.length >= 12 && !isNaN(cellValue)) {
          return "\t".concat(cellValue);
        }

        break;
    }
  }

  return cellValue;
}

function toTxtCellLabel(val) {
  if (/[",\s\n]/.test(val)) {
    return "\"".concat(val.replace(/"/g, '""'), "\"");
  }

  return val;
}

function toCsv($xetable, opts, columns, datas) {
  var content = csvBOM;

  if (opts.isHeader) {
    content += columns.map(function (column) {
      return toTxtCellLabel(getHeaderTitle(opts, column));
    }).join(',') + enterSymbol;
  }

  datas.forEach(function (row) {
    content += columns.map(function (column) {
      return toTxtCellLabel(getCsvCellTypeLabel(column, row[column.id]));
    }).join(',') + enterSymbol;
  });

  if (opts.isFooter) {
    var footerTableData = $xetable.footerTableData;
    var footers = getFooterData(opts, footerTableData);
    footers.forEach(function (rows) {
      content += columns.map(function (column) {
        return toTxtCellLabel(getFooterCellValue($xetable, opts, rows, column));
      }).join(',') + enterSymbol;
    });
  }

  return content;
}

function toTxt($xetable, opts, columns, datas) {
  var content = '';

  if (opts.isHeader) {
    content += columns.map(function (column) {
      return toTxtCellLabel(getHeaderTitle(opts, column));
    }).join('\t') + enterSymbol;
  }

  datas.forEach(function (row) {
    content += columns.map(function (column) {
      return toTxtCellLabel(row[column.id]);
    }).join('\t') + enterSymbol;
  });

  if (opts.isFooter) {
    var footerTableData = $xetable.footerTableData;
    var footers = getFooterData(opts, footerTableData);
    footers.forEach(function (rows) {
      content += columns.map(function (column) {
        return toTxtCellLabel(getFooterCellValue($xetable, opts, rows, column));
      }).join(',') + enterSymbol;
    });
  }

  return content;
}

function hasEllipsis($xetable, column, property, allColumnOverflow) {
  var columnOverflow = column[property];
  var headOverflow = _xeUtils.default.isUndefined(columnOverflow) || _xeUtils.default.isNull(columnOverflow) ? allColumnOverflow : columnOverflow;
  var showEllipsis = headOverflow === 'ellipsis';
  var showTitle = headOverflow === 'title';
  var showTooltip = headOverflow === true || headOverflow === 'tooltip';
  var isEllipsis = showTitle || showTooltip || showEllipsis; // 虚拟滚动不支持动态高度

  if (($xetable.scrollXLoad || $xetable.scrollYLoad) && !isEllipsis) {
    isEllipsis = true;
  }

  return isEllipsis;
}

function createHtmlPage(opts, content) {
  var style = opts.style;
  return ['<!DOCTYPE html><html>', '<head>', '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui">', "<title>".concat(opts.sheetName, "</title>"), "<style>".concat(defaultHtmlStyle, "</style>"), style ? "<style>".concat(style, "</style>") : '', '</head>', "<body>".concat(content, "</body>"), '</html>'].join('');
}

function toHtml($xetable, opts, columns, datas) {
  var id = $xetable.id,
      border = $xetable.border,
      treeConfig = $xetable.treeConfig,
      treeOpts = $xetable.treeOpts,
      isAllSelected = $xetable.isAllSelected,
      isIndeterminate = $xetable.isIndeterminate,
      allHeaderAlign = $xetable.headerAlign,
      allAlign = $xetable.align,
      allFooterAlign = $xetable.footerAlign,
      allColumnOverflow = $xetable.showOverflow,
      allColumnHeaderOverflow = $xetable.showHeaderOverflow,
      mergeList = $xetable.mergeList;
  var isPrint = opts.print,
      isHeader = opts.isHeader,
      isFooter = opts.isFooter,
      isColgroup = opts.isColgroup,
      isMerge = opts.isMerge,
      colgroups = opts.colgroups,
      original = opts.original;
  var allCls = 'check-all';
  var clss = ['vxe-table', "border--".concat(toTableBorder(border)), isPrint ? 'is--print' : '', isHeader ? 'is--header' : ''].filter(function (cls) {
    return cls;
  });
  var tables = ["<table class=\"".concat(clss.join(' '), "\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">"), "<colgroup>".concat(columns.map(function (column) {
    return "<col style=\"width:".concat(column.renderWidth, "px\">");
  }).join(''), "</colgroup>")];

  if (isHeader) {
    tables.push('<thead>');

    if (isColgroup && !original) {
      colgroups.forEach(function (cols) {
        tables.push("<tr>".concat(cols.map(function (column) {
          var headAlign = column.headerAlign || column.align || allHeaderAlign || allAlign;
          var classNames = hasEllipsis($xetable, column, 'showHeaderOverflow', allColumnHeaderOverflow) ? ['col--ellipsis'] : [];
          var cellTitle = getHeaderTitle(opts, column);
          var childWidth = 0;
          var countChild = 0;

          _xeUtils.default.eachTree([column], function (item) {
            if (!item.childNodes || !column.childNodes.length) {
              countChild++;
            }

            childWidth += item.renderWidth;
          }, {
            children: 'childNodes'
          });

          var cellWidth = childWidth - countChild;

          if (headAlign) {
            classNames.push("col--".concat(headAlign));
          }

          if (column.type === 'checkbox') {
            return "<th class=\"".concat(classNames.join(' '), "\" colspan=\"").concat(column._colSpan, "\" rowspan=\"").concat(column._rowSpan, "\"><div ").concat(isPrint ? '' : "style=\"width: ".concat(cellWidth, "px\""), "><input type=\"checkbox\" class=\"").concat(allCls, "\" ").concat(isAllSelected ? 'checked' : '', "><span>").concat(cellTitle, "</span></div></th>");
          }

          return "<th class=\"".concat(classNames.join(' '), "\" colspan=\"").concat(column._colSpan, "\" rowspan=\"").concat(column._rowSpan, "\" title=\"").concat(cellTitle, "\"><div ").concat(isPrint ? '' : "style=\"width: ".concat(cellWidth, "px\""), "><span>").concat(formatText(cellTitle, true), "</span></div></th>");
        }).join(''), "</tr>"));
      });
    } else {
      tables.push("<tr>".concat(columns.map(function (column) {
        var headAlign = column.headerAlign || column.align || allHeaderAlign || allAlign;
        var classNames = hasEllipsis($xetable, column, 'showHeaderOverflow', allColumnHeaderOverflow) ? ['col--ellipsis'] : [];
        var cellTitle = getHeaderTitle(opts, column);

        if (headAlign) {
          classNames.push("col--".concat(headAlign));
        }

        if (column.type === 'checkbox') {
          return "<th class=\"".concat(classNames.join(' '), "\"><div ").concat(isPrint ? '' : "style=\"width: ".concat(column.renderWidth, "px\""), "><input type=\"checkbox\" class=\"").concat(allCls, "\" ").concat(isAllSelected ? 'checked' : '', "><span>").concat(cellTitle, "</span></div></th>");
        }

        return "<th class=\"".concat(classNames.join(' '), "\" title=\"").concat(cellTitle, "\"><div ").concat(isPrint ? '' : "style=\"width: ".concat(column.renderWidth, "px\""), "><span>").concat(formatText(cellTitle, true), "</span></div></th>");
      }).join(''), "</tr>"));
    }

    tables.push('</thead>');
  }

  if (datas.length) {
    tables.push('<tbody>');

    if (treeConfig) {
      datas.forEach(function (item) {
        tables.push('<tr>' + columns.map(function (column) {
          var cellAlign = column.align || allAlign;
          var classNames = hasEllipsis($xetable, column, 'showOverflow', allColumnOverflow) ? ['col--ellipsis'] : [];
          var cellValue = item[column.id];

          if (cellAlign) {
            classNames.push("col--".concat(cellAlign));
          }

          if (column.treeNode) {
            var treeIcon = '';

            if (item._hasChild) {
              treeIcon = "<i class=\"".concat(item._expand ? 'vxe-table--tree-fold-icon' : 'vxe-table--tree-unfold-icon', "\"></i>");
            }

            classNames.push('vxe-table--tree-node');

            if (column.type === 'radio') {
              return "<td class=\"".concat(classNames.join(' '), "\" title=\"").concat(cellValue, "\"><div ").concat(isPrint ? '' : "style=\"width: ".concat(column.renderWidth, "px\""), "><div class=\"vxe-table--tree-node-wrapper\" style=\"padding-left: ").concat(item._level * treeOpts.indent, "px\"><div class=\"vxe-table--tree-icon-wrapper\">").concat(treeIcon, "</div><div class=\"vxe-table--tree-cell\"><input type=\"radio\" name=\"radio_").concat(id, "\" ").concat(item._radioDisabled ? 'disabled ' : '').concat(getBooleanValue(cellValue) ? 'checked' : '', "><span>").concat(item._radioLabel, "</span></div></div></div></td>");
            } else if (column.type === 'checkbox') {
              return "<td class=\"".concat(classNames.join(' '), "\" title=\"").concat(cellValue, "\"><div ").concat(isPrint ? '' : "style=\"width: ".concat(column.renderWidth, "px\""), "><div class=\"vxe-table--tree-node-wrapper\" style=\"padding-left: ").concat(item._level * treeOpts.indent, "px\"><div class=\"vxe-table--tree-icon-wrapper\">").concat(treeIcon, "</div><div class=\"vxe-table--tree-cell\"><input type=\"checkbox\" ").concat(item._checkboxDisabled ? 'disabled ' : '').concat(getBooleanValue(cellValue) ? 'checked' : '', "><span>").concat(item._checkboxLabel, "</span></div></div></div></td>");
            }

            return "<td class=\"".concat(classNames.join(' '), "\" title=\"").concat(cellValue, "\"><div ").concat(isPrint ? '' : "style=\"width: ".concat(column.renderWidth, "px\""), "><div class=\"vxe-table--tree-node-wrapper\" style=\"padding-left: ").concat(item._level * treeOpts.indent, "px\"><div class=\"vxe-table--tree-icon-wrapper\">").concat(treeIcon, "</div><div class=\"vxe-table--tree-cell\">").concat(cellValue, "</div></div></div></td>");
          }

          if (column.type === 'radio') {
            return "<td class=\"".concat(classNames.join(' '), "\"><div ").concat(isPrint ? '' : "style=\"width: ".concat(column.renderWidth, "px\""), "><input type=\"radio\" name=\"radio_").concat(id, "\" ").concat(item._radioDisabled ? 'disabled ' : '').concat(getBooleanValue(cellValue) ? 'checked' : '', "><span>").concat(item._radioLabel, "</span></div></td>");
          } else if (column.type === 'checkbox') {
            return "<td class=\"".concat(classNames.join(' '), "\"><div ").concat(isPrint ? '' : "style=\"width: ".concat(column.renderWidth, "px\""), "><input type=\"checkbox\" ").concat(item._checkboxDisabled ? 'disabled ' : '').concat(getBooleanValue(cellValue) ? 'checked' : '', "><span>").concat(item._checkboxLabel, "</span></div></td>");
          }

          return "<td class=\"".concat(classNames.join(' '), "\" title=\"").concat(cellValue, "\"><div ").concat(isPrint ? '' : "style=\"width: ".concat(column.renderWidth, "px\""), ">").concat(formatText(cellValue, true), "</div></td>");
        }).join('') + '</tr>');
      });
    } else {
      datas.forEach(function (item) {
        tables.push('<tr>' + columns.map(function (column) {
          var cellAlign = column.align || allAlign;
          var classNames = hasEllipsis($xetable, column, 'showOverflow', allColumnOverflow) ? ['col--ellipsis'] : [];
          var cellValue = item[column.id];
          var rowSpan = 1;
          var colSpan = 1;

          if (isMerge && mergeList.length) {
            var _rowIndex = $xetable.getVTRowIndex(item._row);

            var _columnIndex = $xetable.getVTColumnIndex(column);

            var spanRest = (0, _util.mergeBodyMethod)(mergeList, _rowIndex, _columnIndex);

            if (spanRest) {
              var rowspan = spanRest.rowspan,
                  colspan = spanRest.colspan;

              if (!rowspan || !colspan) {
                return '';
              }

              if (rowspan > 1) {
                rowSpan = rowspan;
              }

              if (colspan > 1) {
                colSpan = colspan;
              }
            }
          }

          if (cellAlign) {
            classNames.push("col--".concat(cellAlign));
          }

          if (column.type === 'radio') {
            return "<td class=\"".concat(classNames.join(' '), "\" rowspan=\"").concat(rowSpan, "\" colspan=\"").concat(colSpan, "\"><div ").concat(isPrint ? '' : "style=\"width: ".concat(column.renderWidth, "px\""), "><input type=\"radio\" name=\"radio_").concat(id, "\" ").concat(item._radioDisabled ? 'disabled ' : '').concat(getBooleanValue(cellValue) ? 'checked' : '', "><span>").concat(item._radioLabel, "</span></div></td>");
          } else if (column.type === 'checkbox') {
            return "<td class=\"".concat(classNames.join(' '), "\" rowspan=\"").concat(rowSpan, "\" colspan=\"").concat(colSpan, "\"><div ").concat(isPrint ? '' : "style=\"width: ".concat(column.renderWidth, "px\""), "><input type=\"checkbox\" ").concat(item._checkboxDisabled ? 'disabled ' : '').concat(getBooleanValue(cellValue) ? 'checked' : '', "><span>").concat(item._checkboxLabel, "</span></div></td>");
          }

          return "<td class=\"".concat(classNames.join(' '), "\" rowspan=\"").concat(rowSpan, "\" colspan=\"").concat(colSpan, "\" title=\"").concat(cellValue, "\"><div ").concat(isPrint ? '' : "style=\"width: ".concat(column.renderWidth, "px\""), ">").concat(formatText(cellValue, true), "</div></td>");
        }).join('') + '</tr>');
      });
    }

    tables.push('</tbody>');
  }

  if (isFooter) {
    var footerTableData = $xetable.footerTableData;
    var footers = getFooterData(opts, footerTableData);

    if (footers.length) {
      tables.push('<tfoot>');
      footers.forEach(function (rows) {
        tables.push("<tr>".concat(columns.map(function (column) {
          var footAlign = column.footerAlign || column.align || allFooterAlign || allAlign;
          var classNames = hasEllipsis($xetable, column, 'showOverflow', allColumnOverflow) ? ['col--ellipsis'] : [];
          var cellValue = getFooterCellValue($xetable, opts, rows, column);

          if (footAlign) {
            classNames.push("col--".concat(footAlign));
          }

          return "<td class=\"".concat(classNames.join(' '), "\" title=\"").concat(cellValue, "\"><div ").concat(isPrint ? '' : "style=\"width: ".concat(column.renderWidth, "px\""), ">").concat(formatText(cellValue, true), "</div></td>");
        }).join(''), "</tr>"));
      });
      tables.push('</tfoot>');
    }
  } // 是否半选状态


  var script = !isAllSelected && isIndeterminate ? "<script>(function(){var a=document.querySelector(\".".concat(allCls, "\");if(a){a.indeterminate=true}})()</script>") : '';
  tables.push('</table>', script);
  return isPrint ? tables.join('') : createHtmlPage(opts, tables.join(''));
}

function toXML($xetable, opts, columns, datas) {
  var xml = ['<?xml version="1.0"?>', '<?mso-application progid="Excel.Sheet"?>', '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">', '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">', '<Version>16.00</Version>', '</DocumentProperties>', '<ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">', '<WindowHeight>7920</WindowHeight>', '<WindowWidth>21570</WindowWidth>', '<WindowTopX>32767</WindowTopX>', '<WindowTopY>32767</WindowTopY>', '<ProtectStructure>False</ProtectStructure>', '<ProtectWindows>False</ProtectWindows>', '</ExcelWorkbook>', "<Worksheet ss:Name=\"".concat(opts.sheetName, "\">"), '<Table>', columns.map(function (column) {
    return "<Column ss:Width=\"".concat(column.renderWidth, "\"/>");
  }).join('')].join('');

  if (opts.isHeader) {
    xml += "<Row>".concat(columns.map(function (column) {
      return "<Cell><Data ss:Type=\"String\">".concat(getHeaderTitle(opts, column), "</Data></Cell>");
    }).join(''), "</Row>");
  }

  datas.forEach(function (row) {
    xml += '<Row>' + columns.map(function (column) {
      return "<Cell><Data ss:Type=\"String\">".concat(row[column.id], "</Data></Cell>");
    }).join('') + '</Row>';
  });

  if (opts.isFooter) {
    var footerTableData = $xetable.footerTableData;
    var footers = getFooterData(opts, footerTableData);
    footers.forEach(function (rows) {
      xml += "<Row>".concat(columns.map(function (column) {
        return "<Cell><Data ss:Type=\"String\">".concat(getFooterCellValue($xetable, opts, rows, column), "</Data></Cell>");
      }).join(''), "</Row>");
    });
  }

  return "".concat(xml, "</Table></Worksheet></Workbook>");
}

function getContent($xetable, opts, columns, datas) {
  if (columns.length) {
    switch (opts.type) {
      case 'csv':
        return toCsv($xetable, opts, columns, datas);

      case 'txt':
        return toTxt($xetable, opts, columns, datas);

      case 'html':
        return toHtml($xetable, opts, columns, datas);

      case 'xml':
        return toXML($xetable, opts, columns, datas);
    }
  }

  return '';
}
/**
 * 保存文件到本地
 * @param {*} options 参数
 */


function saveLocalFile(options) {
  var filename = options.filename,
      type = options.type,
      content = options.content;
  var name = "".concat(filename, ".").concat(type);

  if (window.Blob) {
    var blob = content instanceof Blob ? content : getExportBlobByContent(_xeUtils.default.toValueString(content), options);

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, name);
    } else {
      var url = URL.createObjectURL(blob);
      var linkElem = document.createElement('a');
      linkElem.target = '_blank';
      linkElem.download = name;
      linkElem.href = url;
      document.body.appendChild(linkElem);
      linkElem.click();
      document.body.removeChild(linkElem);
      requestAnimationFrame(function () {
        if (linkElem.parentNode) {
          linkElem.parentNode.removeChild(linkElem);
        }

        URL.revokeObjectURL(url);
      });
    }

    return Promise.resolve();
  }

  return Promise.reject(new Error(_utils.default.getLog('vxe.error.notExp')));
}

function downloadFile($xetable, opts, content) {
  var filename = opts.filename,
      type = opts.type,
      download = opts.download;

  if (!download) {
    var blob = getExportBlobByContent(content, opts);
    return Promise.resolve({
      type: type,
      content: content,
      blob: blob
    });
  }

  saveLocalFile({
    filename: filename,
    type: type,
    content: content
  }).then(function () {
    if (opts.message !== false) {
      // 检测弹窗模块
      if (process.env.NODE_ENV === 'development') {
        if (!_vXETable.default.modal) {
          (0, _log.errLog)('vxe.error.reqModule', ['Modal']);
        }
      }

      _vXETable.default.modal.message({
        content: _conf.default.i18n('vxe.table.expSuccess'),
        status: 'success'
      });
    }
  });
}

function clearColumnConvert(columns) {
  _xeUtils.default.eachTree(columns, function (column) {
    delete column._level;
    delete column._colSpan;
    delete column._rowSpan;
    delete column._children;
    delete column.childNodes;
  }, {
    children: 'children'
  });
}

function handleExport($xetable, opts) {
  var remote = opts.remote,
      columns = opts.columns,
      colgroups = opts.colgroups,
      exportMethod = opts.exportMethod,
      afterExportMethod = opts.afterExportMethod;
  return new Promise(function (resolve) {
    if (remote) {
      var params = {
        options: opts,
        $table: $xetable,
        $grid: $xetable.$xegrid
      };
      resolve(exportMethod ? exportMethod(params) : params);
    } else {
      var datas = getExportData($xetable, opts);
      resolve($xetable.preventEvent(null, 'event.export', {
        options: opts,
        columns: columns,
        colgroups: colgroups,
        datas: datas
      }, function () {
        return downloadFile($xetable, opts, getContent($xetable, opts, columns, datas));
      }));
    }
  }).then(function (params) {
    clearColumnConvert(columns);

    if (!opts.print) {
      if (afterExportMethod) {
        afterExportMethod({
          status: true,
          options: opts,
          $table: $xetable,
          $grid: $xetable.$xegrid
        });
      }
    }

    return Object.assign({
      status: true
    }, params);
  }).catch(function () {
    clearColumnConvert(columns);

    if (!opts.print) {
      if (afterExportMethod) {
        afterExportMethod({
          status: false,
          options: opts,
          $table: $xetable,
          $grid: $xetable.$xegrid
        });
      }
    }

    var params = {
      status: false
    };
    return Promise.reject(params);
  });
}

function getElementsByTagName(elem, qualifiedName) {
  return elem.getElementsByTagName(qualifiedName);
}

function getTxtCellKey(now) {
  return "#".concat(now, "@").concat(_xeUtils.default.uniqueId());
}

function replaceTxtCell(cell, vMaps) {
  return cell.replace(/#\d+@\d+/g, function (key) {
    return _xeUtils.default.hasOwnProp(vMaps, key) ? vMaps[key] : key;
  });
}

function getTxtCellValue(val, vMaps) {
  var rest = replaceTxtCell(val, vMaps);
  return rest.replace(/^"+$/g, function (qVal) {
    return '"'.repeat(Math.ceil(qVal.length / 2));
  });
}

function parseCsvAndTxt(columns, content, cellSeparator) {
  var list = content.split(enterSymbol);
  var rows = [];
  var fields = [];

  if (list.length) {
    var vMaps = {};
    var now = Date.now();
    list.forEach(function (rVal) {
      if (rVal) {
        var item = {};
        rVal = rVal.replace(/("")|(\n)/g, function (text, dVal) {
          var key = getTxtCellKey(now);
          vMaps[key] = dVal ? '"' : '\n';
          return key;
        }).replace(/"(.*?)"/g, function (text, cVal) {
          var key = getTxtCellKey(now);
          vMaps[key] = replaceTxtCell(cVal, vMaps);
          return key;
        });
        var cells = rVal.split(cellSeparator);

        if (!fields.length) {
          fields = cells.map(function (val) {
            return getTxtCellValue(val.trim(), vMaps);
          });
        } else {
          cells.forEach(function (val, colIndex) {
            if (colIndex < fields.length) {
              item[fields[colIndex]] = getTxtCellValue(val, vMaps);
            }
          });
          rows.push(item);
        }
      }
    });
  }

  return {
    fields: fields,
    rows: rows
  };
}

function parseCsv(columns, content) {
  return parseCsvAndTxt(columns, content, ',');
}

function parseTxt(columns, content) {
  return parseCsvAndTxt(columns, content, '\t');
}

function parseHTML(columns, content) {
  var domParser = new DOMParser();
  var xmlDoc = domParser.parseFromString(content, 'text/html');
  var bodyNodes = getElementsByTagName(xmlDoc, 'body');
  var rows = [];
  var fields = [];

  if (bodyNodes.length) {
    var tableNodes = getElementsByTagName(bodyNodes[0], 'table');

    if (tableNodes.length) {
      var theadNodes = getElementsByTagName(tableNodes[0], 'thead');

      if (theadNodes.length) {
        _xeUtils.default.arrayEach(getElementsByTagName(theadNodes[0], 'tr'), function (rowNode) {
          _xeUtils.default.arrayEach(getElementsByTagName(rowNode, 'th'), function (cellNode) {
            fields.push(cellNode.textContent);
          });
        });

        var tbodyNodes = getElementsByTagName(tableNodes[0], 'tbody');

        if (tbodyNodes.length) {
          _xeUtils.default.arrayEach(getElementsByTagName(tbodyNodes[0], 'tr'), function (rowNode) {
            var item = {};

            _xeUtils.default.arrayEach(getElementsByTagName(rowNode, 'td'), function (cellNode, colIndex) {
              if (fields[colIndex]) {
                item[fields[colIndex]] = cellNode.textContent || '';
              }
            });

            rows.push(item);
          });
        }
      }
    }
  }

  return {
    fields: fields,
    rows: rows
  };
}

function parseXML(columns, content) {
  var domParser = new DOMParser();
  var xmlDoc = domParser.parseFromString(content, 'application/xml');
  var sheetNodes = getElementsByTagName(xmlDoc, 'Worksheet');
  var rows = [];
  var fields = [];

  if (sheetNodes.length) {
    var tableNodes = getElementsByTagName(sheetNodes[0], 'Table');

    if (tableNodes.length) {
      var rowNodes = getElementsByTagName(tableNodes[0], 'Row');

      if (rowNodes.length) {
        _xeUtils.default.arrayEach(getElementsByTagName(rowNodes[0], 'Cell'), function (cellNode) {
          fields.push(cellNode.textContent);
        });

        _xeUtils.default.arrayEach(rowNodes, function (rowNode, index) {
          if (index) {
            var item = {};
            var cellNodes = getElementsByTagName(rowNode, 'Cell');

            _xeUtils.default.arrayEach(cellNodes, function (cellNode, colIndex) {
              if (fields[colIndex]) {
                item[fields[colIndex]] = cellNode.textContent;
              }
            });

            rows.push(item);
          }
        });
      }
    }
  }

  return {
    fields: fields,
    rows: rows
  };
}
/**
 * 检查导入的列是否完整
 * @param {Array} fields 字段名列表
 * @param {Array} rows 数据列表
 */


function checkImportData(columns, fields) {
  var tableFields = [];
  columns.forEach(function (column) {
    var field = column.property;

    if (field) {
      tableFields.push(field);
    }
  });
  return fields.some(function (field) {
    return tableFields.indexOf(field) > -1;
  });
}

function handleImport($xetable, content, opts) {
  var tableFullColumn = $xetable.tableFullColumn,
      _importResolve = $xetable._importResolve,
      _importReject = $xetable._importReject;
  var rest = {
    fields: [],
    rows: []
  };

  switch (opts.type) {
    case 'csv':
      rest = parseCsv(tableFullColumn, content);
      break;

    case 'txt':
      rest = parseTxt(tableFullColumn, content);
      break;

    case 'html':
      rest = parseHTML(tableFullColumn, content);
      break;

    case 'xml':
      rest = parseXML(tableFullColumn, content);
      break;
  }

  var _rest = rest,
      fields = _rest.fields,
      rows = _rest.rows;
  var status = checkImportData(tableFullColumn, fields);

  if (status) {
    $xetable.createData(rows).then(function (data) {
      var loadRest;

      if (opts.mode === 'insert') {
        loadRest = $xetable.insert(data);
      } else {
        loadRest = $xetable.reloadData(data);
      }

      if (opts.message !== false) {
        // 检测弹窗模块
        if (process.env.NODE_ENV === 'development') {
          if (!_vXETable.default.modal) {
            (0, _log.errLog)('vxe.error.reqModule', ['Modal']);
          }
        }

        _vXETable.default.modal.message({
          content: _conf.default.i18n('vxe.table.impSuccess', [rows.length]),
          status: 'success'
        });
      }

      return loadRest.then(function () {
        if (_importResolve) {
          _importResolve({
            status: true
          });
        }
      });
    });
  } else if (opts.message !== false) {
    // 检测弹窗模块
    if (process.env.NODE_ENV === 'development') {
      if (!_vXETable.default.modal) {
        (0, _log.errLog)('vxe.error.reqModule', ['Modal']);
      }
    }

    _vXETable.default.modal.message({
      content: _conf.default.i18n('vxe.error.impFields'),
      status: 'error'
    });

    if (_importReject) {
      _importReject({
        status: false
      });
    }
  }
}

function handleFileImport($xetable, file, opts) {
  var importMethod = opts.importMethod,
      afterImportMethod = opts.afterImportMethod;

  var _UtilTools$parseFile = _utils.default.parseFile(file),
      type = _UtilTools$parseFile.type,
      filename = _UtilTools$parseFile.filename; // 检查类型，如果为自定义导出，则不需要校验类型


  if (!importMethod && !_xeUtils.default.includes(_vXETable.default.config.importTypes, type)) {
    if (opts.message !== false) {
      // 检测弹窗模块
      if (process.env.NODE_ENV === 'development') {
        if (!_vXETable.default.modal) {
          (0, _log.errLog)('vxe.error.reqModule', ['Modal']);
        }
      }

      _vXETable.default.modal.message({
        content: _conf.default.i18n('vxe.error.notType', [type]),
        status: 'error'
      });
    }

    var params = {
      status: false
    };
    return Promise.reject(params);
  }

  var rest = new Promise(function (resolve, reject) {
    var _importResolve = function _importResolve(params) {
      resolve(params);
      $xetable._importResolve = null;
      $xetable._importReject = null;
    };

    var _importReject = function _importReject(params) {
      reject(params);
      $xetable._importResolve = null;
      $xetable._importReject = null;
    };

    $xetable._importResolve = _importResolve;
    $xetable._importReject = _importReject;

    if (window.FileReader) {
      var options = Object.assign({
        mode: 'insert'
      }, opts, {
        type: type,
        filename: filename
      });

      if (options.remote) {
        if (importMethod) {
          Promise.resolve(importMethod({
            file: file,
            options: options,
            $table: $xetable
          })).then(function () {
            _importResolve({
              status: true
            });
          }).catch(function () {
            _importResolve({
              status: true
            });
          });
        } else {
          _importResolve({
            status: true
          });
        }
      } else {
        $xetable.preventEvent(null, 'event.import', {
          file: file,
          options: options,
          columns: $xetable.tableFullColumn
        }, function () {
          var reader = new FileReader();

          reader.onerror = function () {
            (0, _log.errLog)('vxe.error.notType', [type]);

            _importReject({
              status: false
            });
          };

          reader.onload = function (e) {
            handleImport($xetable, e.target.result, options);
          };

          reader.readAsText(file, options.encoding || 'UTF-8');
        });
      }
    } else {
      // 不支持的浏览器
      if (process.env.NODE_ENV === 'development') {
        (0, _log.errLog)('vxe.error.notExp');
      }

      _importResolve({
        status: true
      });
    }
  });
  return rest.then(function () {
    if (afterImportMethod) {
      afterImportMethod({
        status: true,
        options: opts,
        $table: $xetable
      });
    }
  }).catch(function (e) {
    if (afterImportMethod) {
      afterImportMethod({
        status: false,
        options: opts,
        $table: $xetable
      });
    }

    return Promise.reject(e);
  });
}
/**
 * 读取本地文件
 * @param {*} options 参数
 */


function readLocalFile() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (!fileForm) {
    fileForm = document.createElement('form');
    fileInput = document.createElement('input');
    fileForm.className = 'vxe-table--file-form';
    fileInput.name = 'file';
    fileInput.type = 'file';
    fileForm.appendChild(fileInput);
    document.body.appendChild(fileForm);
  }

  return new Promise(function (resolve, reject) {
    var types = options.types || [];
    var isAllType = !types.length || types.some(function (type) {
      return type === '*';
    });
    fileInput.multiple = !!options.multiple;
    fileInput.accept = isAllType ? '' : ".".concat(types.join(', .'));

    fileInput.onchange = function (evnt) {
      var files = evnt.target.files;
      var file = files[0];
      var errType; // 校验类型

      if (!isAllType) {
        for (var fIndex = 0; fIndex < files.length; fIndex++) {
          var _UtilTools$parseFile2 = _utils.default.parseFile(files[fIndex]),
              type = _UtilTools$parseFile2.type;

          if (!_xeUtils.default.includes(types, type)) {
            errType = type;
            break;
          }
        }
      }

      if (!errType) {
        resolve({
          status: true,
          files: files,
          file: file
        });
      } else {
        if (options.message !== false) {
          // 检测弹窗模块
          if (process.env.NODE_ENV === 'development') {
            if (!_vXETable.default.modal) {
              (0, _log.errLog)('vxe.error.reqModule', ['Modal']);
            }
          }

          _vXETable.default.modal.message({
            content: _conf.default.i18n('vxe.error.notType', [errType]),
            status: 'error'
          });
        }

        var params = {
          status: false,
          files: files,
          file: file
        };
        reject(params);
      }
    };

    fileForm.reset();
    fileInput.click();
  });
}

function removePrintFrame() {
  if (printFrame) {
    if (printFrame.parentNode) {
      try {
        printFrame.contentDocument.write('');
      } catch (e) {}

      printFrame.parentNode.removeChild(printFrame);
    }

    printFrame = null;
  }
}

function appendPrintFrame() {
  if (!printFrame.parentNode) {
    document.body.appendChild(printFrame);
  }
}

function afterPrintEvent() {
  requestAnimationFrame(removePrintFrame);
}

function handlePrint($xetable, opts, content) {
  var beforePrintMethod = opts.beforePrintMethod;

  if (beforePrintMethod) {
    content = beforePrintMethod({
      content: content,
      options: opts,
      $table: $xetable
    }) || '';
  }

  content = createHtmlPage(opts, content);
  var blob = getExportBlobByContent(content, opts);

  if (_dom.browse.msie) {
    removePrintFrame();
    printFrame = createFrame();
    appendPrintFrame();
    printFrame.contentDocument.write(content);
    printFrame.contentDocument.execCommand('print');
  } else {
    if (!printFrame) {
      printFrame = createFrame();

      printFrame.onload = function (evnt) {
        if (evnt.target.src) {
          evnt.target.contentWindow.onafterprint = afterPrintEvent;
          evnt.target.contentWindow.print();
        }
      };
    }

    appendPrintFrame();
    printFrame.src = URL.createObjectURL(blob);
  }
}

function handleExportAndPrint($xetable, options, isPrint) {
  var initStore = $xetable.initStore,
      customOpts = $xetable.customOpts,
      collectColumn = $xetable.collectColumn,
      footerTableData = $xetable.footerTableData,
      treeConfig = $xetable.treeConfig,
      mergeList = $xetable.mergeList,
      isGroup = $xetable.isGroup,
      exportParams = $xetable.exportParams;
  var selectRecords = $xetable.getCheckboxRecords();
  var hasFooter = !!footerTableData.length;
  var hasTree = treeConfig;
  var hasMerge = !hasTree && mergeList.length;
  var defOpts = Object.assign({
    message: true,
    isHeader: true
  }, options);
  var types = defOpts.types || _vXETable.default.config.exportTypes;
  var modes = defOpts.modes;
  var checkMethod = customOpts.checkMethod;
  var exportColumns = collectColumn.slice(0);
  var columns = defOpts.columns; // 处理类型

  var typeList = types.map(function (value) {
    return {
      value: value,
      label: "vxe.export.types.".concat(value)
    };
  });
  var modeList = modes.map(function (value) {
    return {
      value: value,
      label: "vxe.export.modes.".concat(value)
    };
  }); // 默认选中

  _xeUtils.default.eachTree(exportColumns, function (column, index, items, path, parent) {
    var isColGroup = column.children && column.children.length;

    if (isColGroup || defaultFilterExportColumn(column)) {
      column.checked = columns ? columns.some(function (item) {
        if ((0, _util.isColumnInfo)(item)) {
          return column === item;
        } else if (_xeUtils.default.isString(item)) {
          return column.field === item;
        } else {
          var colid = item.id || item.colId;
          var type = item.type;
          var field = item.property || item.field;

          if (colid) {
            return column.id === colid;
          } else if (field && type) {
            return column.property === field && column.type === type;
          } else if (field) {
            return column.property === field;
          } else if (type) {
            return column.type === type;
          }
        }
      }) : column.visible;
      column.halfChecked = false;
      column.disabled = parent && parent.disabled || (checkMethod ? !checkMethod({
        column: column
      }) : false);
    }
  }); // 更新条件


  Object.assign($xetable.exportStore, {
    columns: exportColumns,
    typeList: typeList,
    modeList: modeList,
    hasFooter: hasFooter,
    hasMerge: hasMerge,
    hasTree: hasTree,
    isPrint: isPrint,
    hasColgroup: isGroup,
    visible: true
  }); // 默认参数

  if (!initStore.export) {
    Object.assign(exportParams, {
      mode: selectRecords.length ? 'selected' : 'current'
    }, defOpts);
  }

  if (modes.indexOf(exportParams.mode) === -1) {
    exportParams.mode = modes[0];
  }

  if (types.indexOf(exportParams.type) === -1) {
    exportParams.type = types[0];
  }

  initStore.export = true;
  return $xetable.$nextTick();
}

var getConvertColumns = function getConvertColumns(columns) {
  var result = [];
  columns.forEach(function (column) {
    if (column.childNodes && column.childNodes.length) {
      result.push(column);
      result.push.apply(result, _toConsumableArray(getConvertColumns(column.childNodes)));
    } else {
      result.push(column);
    }
  });
  return result;
};

var convertToRows = function convertToRows(originColumns) {
  var maxLevel = 1;

  var traverse = function traverse(column, parent) {
    if (parent) {
      column._level = parent._level + 1;

      if (maxLevel < column._level) {
        maxLevel = column._level;
      }
    }

    if (column.childNodes && column.childNodes.length) {
      var colSpan = 0;
      column.childNodes.forEach(function (subColumn) {
        traverse(subColumn, column);
        colSpan += subColumn._colSpan;
      });
      column._colSpan = colSpan;
    } else {
      column._colSpan = 1;
    }
  };

  originColumns.forEach(function (column) {
    column._level = 1;
    traverse(column);
  });
  var rows = [];

  for (var i = 0; i < maxLevel; i++) {
    rows.push([]);
  }

  var allColumns = getConvertColumns(originColumns);
  allColumns.forEach(function (column) {
    if (column.childNodes && column.childNodes.length) {
      column._rowSpan = 1;
    } else {
      column._rowSpan = maxLevel - column._level + 1;
    }

    rows[column._level - 1].push(column);
  });
  return rows;
};

var _default = {
  methods: {
    /**
     * 导出文件，支持 csv/html/xml/txt
     * 如果是树表格，则默认是导出所有节点
     * 如果是启用了虚拟滚动，则只能导出数据源，可以配合 dataFilterMethod 函数自行转换数据
     * @param {Object} options 参数
     */
    _exportData: function _exportData(options) {
      var _this = this;

      var $xegrid = this.$xegrid,
          isGroup = this.isGroup,
          tableGroupColumn = this.tableGroupColumn,
          tableFullColumn = this.tableFullColumn,
          afterFullData = this.afterFullData,
          treeConfig = this.treeConfig,
          treeOpts = this.treeOpts,
          exportOpts = this.exportOpts;
      var opts = Object.assign({
        // filename: '',
        // sheetName: '',
        // original: false,
        // message: false,
        isHeader: true,
        isFooter: true,
        isColgroup: true,
        isMerge: false,
        isAllExpand: false,
        download: true,
        type: 'csv',
        mode: 'current' // data: null,
        // remote: false,
        // dataFilterMethod: null,
        // footerFilterMethod: null,
        // exportMethod: null,
        // columnFilterMethod: null,
        // beforeExportMethod: null,
        // afterExportMethod: null

      }, exportOpts, {
        print: false
      }, options);
      var type = opts.type,
          mode = opts.mode,
          columns = opts.columns,
          original = opts.original,
          beforeExportMethod = opts.beforeExportMethod;
      var groups = [];
      var customCols = columns && columns.length ? columns : null; // 如果设置源数据，则默认导出设置了字段的列

      var columnFilterMethod = opts.columnFilterMethod;

      if (!customCols && !columnFilterMethod) {
        columnFilterMethod = original ? function (_ref) {
          var column = _ref.column;
          return column.property;
        } : function (_ref2) {
          var column = _ref2.column;
          return defaultFilterExportColumn(column);
        };
      }

      if (customCols) {
        groups = _xeUtils.default.searchTree(_xeUtils.default.mapTree(customCols, function (item) {
          var targetColumn;

          if (item) {
            if ((0, _util.isColumnInfo)(item)) {
              targetColumn = item;
            } else if (_xeUtils.default.isString(item)) {
              targetColumn = _this.getColumnByField(item);
            } else {
              var colid = item.id || item.colId;
              var _type = item.type;
              var field = item.property || item.field;

              if (colid) {
                targetColumn = _this.getColumnById(colid);
              } else if (field && _type) {
                targetColumn = tableFullColumn.find(function (column) {
                  return column.property === field && column.type === _type;
                });
              } else if (field) {
                targetColumn = _this.getColumnByField(field);
              } else if (_type) {
                targetColumn = tableFullColumn.find(function (column) {
                  return column.type === _type;
                });
              }
            }

            return targetColumn || {};
          }
        }, {
          children: 'childNodes',
          mapChildren: '_children'
        }), function (column, index) {
          return (0, _util.isColumnInfo)(column) && (!columnFilterMethod || columnFilterMethod({
            column: column,
            $columnIndex: index
          }));
        }, {
          children: '_children',
          mapChildren: 'childNodes',
          original: true
        });
      } else {
        groups = _xeUtils.default.searchTree(isGroup ? tableGroupColumn : tableFullColumn, function (column, index) {
          return column.visible && (!columnFilterMethod || columnFilterMethod({
            column: column,
            $columnIndex: index
          }));
        }, {
          children: 'children',
          mapChildren: 'childNodes',
          original: true
        });
      } // 获取所有列


      var cols = [];

      _xeUtils.default.eachTree(groups, function (column) {
        var isColGroup = column.children && column.children.length;

        if (!isColGroup) {
          cols.push(column);
        }
      }, {
        children: 'childNodes'
      }); // 构建分组层级


      opts.columns = cols;
      opts.colgroups = convertToRows(groups);

      if (!opts.filename) {
        opts.filename = _conf.default.i18n(opts.original ? 'vxe.table.expOriginFilename' : 'vxe.table.expFilename', [_xeUtils.default.toDateString(Date.now(), 'yyyyMMddHHmmss')]);
      }

      if (!opts.sheetName) {
        opts.sheetName = document.title;
      } // 检查类型，如果为自定义导出，则不需要校验类型


      if (!opts.exportMethod && !_xeUtils.default.includes(_vXETable.default.config.exportTypes, type)) {
        if (process.env.NODE_ENV === 'development') {
          (0, _log.errLog)('vxe.error.notType', [type]);
        }

        var params = {
          status: false
        };
        return Promise.reject(params);
      }

      if (!opts.print) {
        if (beforeExportMethod) {
          beforeExportMethod({
            options: opts,
            $table: this,
            $grid: $xegrid
          });
        }
      }

      if (!opts.data) {
        opts.data = afterFullData;

        if (mode === 'selected') {
          var selectRecords = this.getCheckboxRecords();

          if (['html', 'pdf'].indexOf(type) > -1 && treeConfig) {
            opts.data = _xeUtils.default.searchTree(this.getTableData().fullData, function (item) {
              return selectRecords.indexOf(item) > -1;
            }, Object.assign({}, treeOpts, {
              data: '_row'
            }));
          } else {
            opts.data = selectRecords;
          }
        } else if (mode === 'all') {
          if (process.env.NODE_ENV === 'development') {
            if (!$xegrid) {
              (0, _log.warnLog)('vxe.error.errProp', ['all', 'mode=current,selected']);
            }
          }

          if ($xegrid && !opts.remote) {
            var _$xegrid$proxyOpts = $xegrid.proxyOpts,
                beforeQueryAll = _$xegrid$proxyOpts.beforeQueryAll,
                afterQueryAll = _$xegrid$proxyOpts.afterQueryAll,
                _$xegrid$proxyOpts$aj = _$xegrid$proxyOpts.ajax,
                ajax = _$xegrid$proxyOpts$aj === void 0 ? {} : _$xegrid$proxyOpts$aj,
                _$xegrid$proxyOpts$pr = _$xegrid$proxyOpts.props,
                props = _$xegrid$proxyOpts$pr === void 0 ? {} : _$xegrid$proxyOpts$pr;
            var ajaxMethods = ajax.queryAll;

            if (process.env.NODE_ENV === 'development') {
              if (!ajaxMethods) {
                (0, _log.warnLog)('vxe.error.notFunc', ['proxy-config.ajax.queryAll']);
              }
            }

            if (ajaxMethods) {
              var _params = {
                $table: this,
                $grid: $xegrid,
                sort: $xegrid.sortData,
                filters: $xegrid.filterData,
                form: $xegrid.formData,
                target: ajaxMethods,
                options: opts
              };
              return Promise.resolve((beforeQueryAll || ajaxMethods)(_params)).catch(function (e) {
                return e;
              }).then(function (rest) {
                opts.data = (props.list ? _xeUtils.default.get(rest, props.list) : rest) || [];

                if (afterQueryAll) {
                  afterQueryAll(_params);
                }

                return handleExport(_this, opts);
              });
            }
          }
        }
      }

      return handleExport(this, opts);
    },
    _importByFile: function _importByFile(file, options) {
      var opts = Object.assign({}, options);
      var beforeImportMethod = opts.beforeImportMethod;

      if (beforeImportMethod) {
        beforeImportMethod({
          options: opts,
          $table: this
        });
      }

      return handleFileImport(this, file, opts);
    },
    _importData: function _importData(options) {
      var _this2 = this;

      var opts = Object.assign({
        types: _vXETable.default.config.importTypes // beforeImportMethod: null,
        // afterImportMethod: null

      }, this.importOpts, options);
      var beforeImportMethod = opts.beforeImportMethod,
          afterImportMethod = opts.afterImportMethod;

      if (beforeImportMethod) {
        beforeImportMethod({
          options: opts,
          $table: this
        });
      }

      return readLocalFile(opts).catch(function (e) {
        if (afterImportMethod) {
          afterImportMethod({
            status: false,
            options: opts,
            $table: _this2
          });
        }

        return Promise.reject(e);
      }).then(function (params) {
        var file = params.file;
        return handleFileImport(_this2, file, opts);
      });
    },
    _saveFile: function _saveFile(options) {
      return saveLocalFile(options);
    },
    _readFile: function _readFile(options) {
      return readLocalFile(options);
    },
    _print: function _print(options) {
      var _this3 = this;

      var opts = Object.assign({
        original: false // beforePrintMethod

      }, this.printOpts, options, {
        type: 'html',
        download: false,
        remote: false,
        print: true
      });

      if (!opts.sheetName) {
        opts.sheetName = document.title;
      }

      return new Promise(function (resolve) {
        if (opts.content) {
          resolve(handlePrint(_this3, opts, opts.content));
        } else {
          resolve(_this3.exportData(opts).then(function (_ref3) {
            var content = _ref3.content;
            return handlePrint(_this3, opts, content);
          }));
        }
      });
    },
    _openImport: function _openImport(options) {
      var defOpts = Object.assign({
        mode: 'insert',
        message: true,
        types: _vXETable.default.config.importTypes
      }, options, this.importOpts);
      var types = defOpts.types;
      var isTree = !!this.getTreeStatus();

      if (isTree) {
        if (defOpts.message) {
          _vXETable.default.modal.message({
            content: _conf.default.i18n('vxe.error.treeNotImp'),
            status: 'error'
          });
        }

        return;
      }

      if (!this.importConfig) {
        (0, _log.errLog)('vxe.error.reqProp', ['import-config']);
      } // 处理类型


      var typeList = types.map(function (value) {
        return {
          value: value,
          label: "vxe.export.types.".concat(value)
        };
      });
      var modeList = defOpts.modes.map(function (value) {
        return {
          value: value,
          label: "vxe.import.modes.".concat(value)
        };
      });
      Object.assign(this.importStore, {
        file: null,
        type: '',
        filename: '',
        modeList: modeList,
        typeList: typeList,
        visible: true
      });
      Object.assign(this.importParams, defOpts);
      this.initStore.import = true;
    },
    _openExport: function _openExport(options) {
      var exportOpts = this.exportOpts;

      if (process.env.NODE_ENV === 'development') {
        if (!this.exportConfig) {
          (0, _log.errLog)('vxe.error.reqProp', ['export-config']);
        }
      }

      return handleExportAndPrint(this, Object.assign({}, exportOpts, options));
    },
    _openPrint: function _openPrint(options) {
      var printOpts = this.printOpts;

      if (process.env.NODE_ENV === 'development') {
        if (!this.printConfig) {
          (0, _log.errLog)('vxe.error.reqProp', ['print-config']);
        }
      }

      return handleExportAndPrint(this, Object.assign({}, printOpts, options), true);
    }
  }
};
exports.default = _default;