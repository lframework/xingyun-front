"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcTreeLine = calcTreeLine;
exports.clearTableAllStatus = clearTableAllStatus;
exports.clearTableDefaultStatus = clearTableDefaultStatus;
exports.getColMinWidth = getColMinWidth;
exports.getColumnConfig = getColumnConfig;
exports.getOffsetSize = getOffsetSize;
exports.getRowid = getRowid;
exports.getRowkey = getRowkey;
exports.handleFieldOrColumn = handleFieldOrColumn;
exports.isColumnInfo = isColumnInfo;
exports.mergeBodyMethod = mergeBodyMethod;
exports.removeScrollListener = removeScrollListener;
exports.restoreScrollListener = restoreScrollListener;
exports.restoreScrollLocation = restoreScrollLocation;
exports.toFilters = toFilters;
exports.toTreePathSeq = toTreePathSeq;

var _vXETable = _interopRequireDefault(require("../../v-x-e-table"));

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _columnInfo = require("./columnInfo");

var _dom = _interopRequireDefault(require("../../tools/dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lineOffsetSizes = {
  mini: 3,
  small: 2,
  medium: 1
};

function restoreScrollLocation(_vm, scrollLeft, scrollTop) {
  return _vm.clearScroll().then(function () {
    if (scrollLeft || scrollTop) {
      // 重置最后滚动状态
      _vm.lastScrollLeft = 0;
      _vm.lastScrollTop = 0; // 还原滚动状态

      return _vm.scrollTo(scrollLeft, scrollTop);
    }
  });
}

function toTreePathSeq(path) {
  return path.map(function (num, i) {
    return i % 2 === 0 ? Number(num) + 1 : '.';
  }).join('');
}

function removeScrollListener(scrollElem) {
  if (scrollElem && scrollElem._onscroll) {
    scrollElem.onscroll = null;
  }
}

function restoreScrollListener(scrollElem) {
  if (scrollElem && scrollElem._onscroll) {
    scrollElem.onscroll = scrollElem._onscroll;
  }
} // 行主键 key


function getRowkey($xetable) {
  return $xetable.rowOpts.keyField || $xetable.rowId || '_X_ROW_KEY';
} // 行主键 value


function getRowid($xetable, row) {
  var rowid = _xeUtils.default.get(row, getRowkey($xetable));

  return _xeUtils.default.eqNull(rowid) ? '' : encodeURIComponent(rowid);
}

function getPaddingLeftRightSize(elem) {
  if (elem) {
    var computedStyle = getComputedStyle(elem);

    var paddingLeft = _xeUtils.default.toNumber(computedStyle.paddingLeft);

    var paddingRight = _xeUtils.default.toNumber(computedStyle.paddingRight);

    return paddingLeft + paddingRight;
  }

  return 0;
}

function getElemenMarginWidth(elem) {
  if (elem) {
    var computedStyle = getComputedStyle(elem);

    var marginLeft = _xeUtils.default.toNumber(computedStyle.marginLeft);

    var marginRight = _xeUtils.default.toNumber(computedStyle.marginRight);

    return elem.offsetWidth + marginLeft + marginRight;
  }

  return 0;
}

function handleFieldOrColumn(_vm, fieldOrColumn) {
  if (fieldOrColumn) {
    return _xeUtils.default.isString(fieldOrColumn) ? _vm.getColumnByField(fieldOrColumn) : fieldOrColumn;
  }

  return null;
}

function queryCellElement(cell, selector) {
  return cell.querySelector('.vxe-cell' + selector);
}

function toFilters(filters) {
  if (filters && _xeUtils.default.isArray(filters)) {
    return filters.map(function (_ref) {
      var label = _ref.label,
          value = _ref.value,
          data = _ref.data,
          resetValue = _ref.resetValue,
          checked = _ref.checked;
      return {
        label: label,
        value: value,
        data: data,
        resetValue: resetValue,
        checked: !!checked,
        _checked: !!checked
      };
    });
  }

  return filters;
}

function getColMinWidth(params) {
  var $table = params.$table,
      column = params.column,
      cell = params.cell;
  var allColumnHeaderOverflow = $table.showHeaderOverflow,
      resizableOpts = $table.resizableOpts;
  var minWidth = resizableOpts.minWidth; // 如果自定义调整宽度逻辑

  if (minWidth) {
    var customMinWidth = _xeUtils.default.isFunction(minWidth) ? minWidth(params) : minWidth;

    if (customMinWidth !== 'auto') {
      return Math.max(1, _xeUtils.default.toNumber(customMinWidth));
    }
  }

  var showHeaderOverflow = column.showHeaderOverflow,
      colMinWidth = column.minWidth;
  var headOverflow = _xeUtils.default.isUndefined(showHeaderOverflow) || _xeUtils.default.isNull(showHeaderOverflow) ? allColumnHeaderOverflow : showHeaderOverflow;
  var showEllipsis = headOverflow === 'ellipsis';
  var showTitle = headOverflow === 'title';
  var showTooltip = headOverflow === true || headOverflow === 'tooltip';
  var hasEllipsis = showTitle || showTooltip || showEllipsis;

  var minTitleWidth = _xeUtils.default.floor((_xeUtils.default.toNumber(getComputedStyle(cell).fontSize) || 14) * 1.6);

  var paddingLeftRight = getPaddingLeftRightSize(cell) + getPaddingLeftRightSize(queryCellElement(cell, ''));
  var mWidth = minTitleWidth + paddingLeftRight; // 默认最小宽处理

  if (hasEllipsis) {
    var checkboxIconWidth = getPaddingLeftRightSize(queryCellElement(cell, '--title>.vxe-cell--checkbox'));
    var requiredIconWidth = getElemenMarginWidth(queryCellElement(cell, '>.vxe-cell--required-icon'));
    var editIconWidth = getElemenMarginWidth(queryCellElement(cell, '>.vxe-cell--edit-icon'));
    var helpIconWidth = getElemenMarginWidth(queryCellElement(cell, '>.vxe-cell-help-icon'));
    var sortIconWidth = getElemenMarginWidth(queryCellElement(cell, '>.vxe-cell--sort'));
    var filterIconWidth = getElemenMarginWidth(queryCellElement(cell, '>.vxe-cell--filter'));
    mWidth += checkboxIconWidth + requiredIconWidth + editIconWidth + helpIconWidth + filterIconWidth + sortIconWidth;
  } // 如果设置最小宽


  if (colMinWidth) {
    var tableBody = $table.$refs.tableBody;
    var bodyElem = tableBody ? tableBody.$el : null;

    if (bodyElem) {
      if (_dom.default.isScale(colMinWidth)) {
        var bodyWidth = bodyElem.clientWidth - 1;
        var meanWidth = bodyWidth / 100;
        return Math.max(mWidth, Math.floor(_xeUtils.default.toInteger(colMinWidth) * meanWidth));
      } else if (_dom.default.isPx(colMinWidth)) {
        return Math.max(mWidth, _xeUtils.default.toInteger(colMinWidth));
      }
    }
  }

  return mWidth;
}

function countTreeExpand(prevRow, params) {
  var count = 1;

  if (!prevRow) {
    return count;
  }

  var $table = params.$table;
  var rowChildren = prevRow[$table.treeOpts.children];

  if ($table.isTreeExpandByRow(prevRow)) {
    for (var index = 0; index < rowChildren.length; index++) {
      count += countTreeExpand(rowChildren[index], params);
    }
  }

  return count;
}

function getOffsetSize($xetable) {
  return lineOffsetSizes[$xetable.vSize] || 0;
}

function calcTreeLine(params, items, rIndex) {
  var $table = params.$table;
  var expandSize = 1;

  if (rIndex) {
    expandSize = countTreeExpand(items[rIndex - 1], params);
  }

  return $table.rowHeight * expandSize - (rIndex ? 1 : 12 - getOffsetSize($table));
}

function mergeBodyMethod(mergeList, _rowIndex, _columnIndex) {
  for (var mIndex = 0; mIndex < mergeList.length; mIndex++) {
    var _mergeList$mIndex = mergeList[mIndex],
        mergeRowIndex = _mergeList$mIndex.row,
        mergeColIndex = _mergeList$mIndex.col,
        mergeRowspan = _mergeList$mIndex.rowspan,
        mergeColspan = _mergeList$mIndex.colspan;

    if (mergeColIndex > -1 && mergeRowIndex > -1 && mergeRowspan && mergeColspan) {
      if (mergeRowIndex === _rowIndex && mergeColIndex === _columnIndex) {
        return {
          rowspan: mergeRowspan,
          colspan: mergeColspan
        };
      }

      if (_rowIndex >= mergeRowIndex && _rowIndex < mergeRowIndex + mergeRowspan && _columnIndex >= mergeColIndex && _columnIndex < mergeColIndex + mergeColspan) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    }
  }
}

function clearTableDefaultStatus(_vm) {
  _vm.initStatus = false;

  _vm.clearSort();

  _vm.clearCurrentRow();

  _vm.clearCurrentColumn();

  _vm.clearRadioRow();

  _vm.clearRadioReserve();

  _vm.clearCheckboxRow();

  _vm.clearCheckboxReserve();

  _vm.clearRowExpand();

  _vm.clearTreeExpand();

  _vm.clearTreeExpandReserve();

  if (_vm.clearActived && _vXETable.default._edit) {
    _vm.clearActived();
  }

  if (_vm.clearSelected && (_vm.keyboardConfig || _vm.mouseConfig)) {
    _vm.clearSelected();
  }

  if (_vm.clearCellAreas && _vm.mouseConfig) {
    _vm.clearCellAreas();

    _vm.clearCopyCellArea();
  }

  return _vm.clearScroll();
}

function clearTableAllStatus(_vm) {
  if (_vm.clearFilter && _vXETable.default._filter) {
    _vm.clearFilter();
  }

  return clearTableDefaultStatus(_vm);
}

function isColumnInfo(column) {
  return column instanceof _columnInfo.ColumnInfo;
}

function getColumnConfig($xetable, _vm, options) {
  return isColumnInfo(_vm) ? _vm : new _columnInfo.ColumnInfo($xetable, _vm, options);
}