"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _vXETable = _interopRequireDefault(require("../../v-x-e-table"));

var _utils = _interopRequireWildcard(require("../../tools/utils"));

var _util = require("./util");

var _dom = _interopRequireDefault(require("../../tools/dom"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var renderType = 'body'; // 滚动、拖动过程中不需要触发

function isOperateMouse($xetable) {
  return $xetable._isResize || $xetable.lastScrollTime && Date.now() < $xetable.lastScrollTime + $xetable.delayHover;
}

function renderLine(h, _vm, $xetable, params) {
  var row = params.row,
      column = params.column;
  var treeOpts = $xetable.treeOpts,
      treeConfig = $xetable.treeConfig,
      fullAllDataRowIdData = $xetable.fullAllDataRowIdData;
  var slots = column.slots,
      treeNode = column.treeNode;
  var rowid = (0, _util.getRowid)($xetable, row);
  var rest = fullAllDataRowIdData[rowid];
  var rLevel = 0;
  var rIndex = 0;
  var items = [];

  if (rest) {
    rLevel = rest.level;
    rIndex = rest._index;
    items = rest.items;
  }

  if (slots && slots.line) {
    return $xetable.callSlot(slots.line, params, h);
  }

  if (treeConfig && treeNode && treeOpts.line) {
    return [h('div', {
      class: 'vxe-tree--line-wrapper'
    }, [h('div', {
      class: 'vxe-tree--line',
      style: {
        height: "".concat((0, _util.calcTreeLine)(params, items, rIndex), "px"),
        left: "".concat(rLevel * treeOpts.indent + (rLevel ? 2 - (0, _util.getOffsetSize)($xetable) : 0) + 16, "px")
      }
    })])];
  }

  return [];
}
/**
 * 渲染列
 */


function renderColumn(h, _vm, $xetable, seq, rowid, fixedType, rowLevel, row, rowIndex, $rowIndex, _rowIndex, column, $columnIndex, columns, items) {
  var _ref2;

  var tableListeners = $xetable.$listeners,
      afterFullData = $xetable.afterFullData,
      tableData = $xetable.tableData,
      height = $xetable.height,
      columnKey = $xetable.columnKey,
      overflowX = $xetable.overflowX,
      sYOpts = $xetable.sYOpts,
      scrollXLoad = $xetable.scrollXLoad,
      scrollYLoad = $xetable.scrollYLoad,
      highlightCurrentRow = $xetable.highlightCurrentRow,
      allColumnOverflow = $xetable.showOverflow,
      isAllOverflow = $xetable.isAllOverflow,
      allAlign = $xetable.align,
      currentColumn = $xetable.currentColumn,
      cellClassName = $xetable.cellClassName,
      cellStyle = $xetable.cellStyle,
      mergeList = $xetable.mergeList,
      spanMethod = $xetable.spanMethod,
      radioOpts = $xetable.radioOpts,
      checkboxOpts = $xetable.checkboxOpts,
      expandOpts = $xetable.expandOpts,
      treeOpts = $xetable.treeOpts,
      tooltipOpts = $xetable.tooltipOpts,
      mouseConfig = $xetable.mouseConfig,
      editConfig = $xetable.editConfig,
      editOpts = $xetable.editOpts,
      editRules = $xetable.editRules,
      validOpts = $xetable.validOpts,
      editStore = $xetable.editStore,
      validStore = $xetable.validStore,
      tooltipConfig = $xetable.tooltipConfig,
      rowOpts = $xetable.rowOpts,
      columnOpts = $xetable.columnOpts;
  var type = column.type,
      cellRender = column.cellRender,
      editRender = column.editRender,
      align = column.align,
      showOverflow = column.showOverflow,
      className = column.className,
      treeNode = column.treeNode;
  var actived = editStore.actived;
  var scrollYRHeight = sYOpts.rHeight;
  var rowHeight = rowOpts.height;
  var showAllTip = tooltipOpts.showAll || tooltipOpts.enabled;
  var columnIndex = $xetable.getColumnIndex(column);

  var _columnIndex = $xetable.getVTColumnIndex(column);

  var isEdit = (0, _utils.isEnableConf)(editRender);
  var fixedHiddenColumn = fixedType ? column.fixed !== fixedType : column.fixed && overflowX;
  var cellOverflow = _xeUtils.default.isUndefined(showOverflow) || _xeUtils.default.isNull(showOverflow) ? allColumnOverflow : showOverflow;
  var showEllipsis = cellOverflow === 'ellipsis';
  var showTitle = cellOverflow === 'title';
  var showTooltip = cellOverflow === true || cellOverflow === 'tooltip';
  var hasEllipsis = showTitle || showTooltip || showEllipsis;
  var isDirty;
  var tdOns = {};
  var cellAlign = align || allAlign;
  var hasValidError = validStore.row === row && validStore.column === column;
  var showValidTip = editRules && validOpts.showMessage && (validOpts.message === 'default' ? height || tableData.length > 1 : validOpts.message === 'inline');
  var attrs = {
    colid: column.id
  };
  var bindMouseenter = tableListeners['cell-mouseenter'];
  var bindMouseleave = tableListeners['cell-mouseleave'];
  var triggerDblclick = editRender && editConfig && editOpts.trigger === 'dblclick';
  var params = {
    $table: $xetable,
    seq: seq,
    rowid: rowid,
    row: row,
    rowIndex: rowIndex,
    $rowIndex: $rowIndex,
    _rowIndex: _rowIndex,
    column: column,
    columnIndex: columnIndex,
    $columnIndex: $columnIndex,
    _columnIndex: _columnIndex,
    fixed: fixedType,
    type: renderType,
    isHidden: fixedHiddenColumn,
    level: rowLevel,
    visibleData: afterFullData,
    data: tableData,
    items: items
  }; // 虚拟滚动不支持动态高度

  if ((scrollXLoad || scrollYLoad) && !hasEllipsis) {
    showEllipsis = hasEllipsis = true;
  } // hover 进入事件


  if (showTitle || showTooltip || showAllTip || bindMouseenter || tooltipConfig) {
    tdOns.mouseenter = function (evnt) {
      if (isOperateMouse($xetable)) {
        return;
      }

      if (showTitle) {
        _dom.default.updateCellTitle(evnt.currentTarget, column);
      } else if (showTooltip || showAllTip) {
        // 如果配置了显示 tooltip
        $xetable.triggerBodyTooltipEvent(evnt, params);
      }

      if (bindMouseenter) {
        $xetable.emitEvent('cell-mouseenter', Object.assign({
          cell: evnt.currentTarget
        }, params), evnt);
      }
    };
  } // hover 退出事件


  if (showTooltip || showAllTip || bindMouseleave || tooltipConfig) {
    tdOns.mouseleave = function (evnt) {
      if (isOperateMouse($xetable)) {
        return;
      }

      if (showTooltip || showAllTip) {
        $xetable.handleTargetLeaveEvent(evnt);
      }

      if (bindMouseleave) {
        $xetable.emitEvent('cell-mouseleave', Object.assign({
          cell: evnt.currentTarget
        }, params), evnt);
      }
    };
  } // 按下事件处理


  if (checkboxOpts.range || mouseConfig) {
    tdOns.mousedown = function (evnt) {
      $xetable.triggerCellMousedownEvent(evnt, params);
    };
  } // 点击事件处理


  if (rowOpts.isCurrent || highlightCurrentRow || tableListeners['cell-click'] || editRender && editConfig || expandOpts.trigger === 'row' || expandOpts.trigger === 'cell' || radioOpts.trigger === 'row' || column.type === 'radio' && radioOpts.trigger === 'cell' || checkboxOpts.trigger === 'row' || column.type === 'checkbox' && checkboxOpts.trigger === 'cell' || treeOpts.trigger === 'row' || column.treeNode && treeOpts.trigger === 'cell') {
    tdOns.click = function (evnt) {
      $xetable.triggerCellClickEvent(evnt, params);
    };
  } // 双击事件处理


  if (triggerDblclick || tableListeners['cell-dblclick']) {
    tdOns.dblclick = function (evnt) {
      $xetable.triggerCellDblclickEvent(evnt, params);
    };
  } // 合并行或列


  if (mergeList.length) {
    var spanRest = (0, _util.mergeBodyMethod)(mergeList, _rowIndex, _columnIndex);

    if (spanRest) {
      var rowspan = spanRest.rowspan,
          colspan = spanRest.colspan;

      if (!rowspan || !colspan) {
        return null;
      }

      if (rowspan > 1) {
        attrs.rowspan = rowspan;
      }

      if (colspan > 1) {
        attrs.colspan = colspan;
      }
    }
  } else if (spanMethod) {
    // 自定义合并行或列的方法
    var _ref = spanMethod(params) || {},
        _ref$rowspan = _ref.rowspan,
        _rowspan = _ref$rowspan === void 0 ? 1 : _ref$rowspan,
        _ref$colspan = _ref.colspan,
        _colspan = _ref$colspan === void 0 ? 1 : _ref$colspan;

    if (!_rowspan || !_colspan) {
      return null;
    }

    if (_rowspan > 1) {
      attrs.rowspan = _rowspan;
    }

    if (_colspan > 1) {
      attrs.colspan = _colspan;
    }
  } // 如果被合并不可隐藏


  if (fixedHiddenColumn && mergeList) {
    if (attrs.colspan > 1 || attrs.rowspan > 1) {
      fixedHiddenColumn = false;
    }
  } // 如果编辑列开启显示状态


  if (!fixedHiddenColumn && editConfig && (editRender || cellRender) && (editOpts.showStatus || editOpts.showUpdateStatus)) {
    isDirty = $xetable.isUpdateByRow(row, column.property);
  }

  var tdVNs = [];

  if (fixedHiddenColumn && (allColumnOverflow ? isAllOverflow : allColumnOverflow)) {
    tdVNs.push(h('div', {
      class: ['vxe-cell', {
        'c--title': showTitle,
        'c--tooltip': showTooltip,
        'c--ellipsis': showEllipsis
      }],
      style: {
        maxHeight: hasEllipsis && (scrollYRHeight || rowHeight) ? "".concat(scrollYRHeight || rowHeight, "px") : ''
      }
    }));
  } else {
    // 渲染单元格
    tdVNs.push.apply(tdVNs, _toConsumableArray(renderLine(h, _vm, $xetable, params)).concat([h('div', {
      class: ['vxe-cell', {
        'c--title': showTitle,
        'c--tooltip': showTooltip,
        'c--ellipsis': showEllipsis
      }],
      style: {
        maxHeight: hasEllipsis && (scrollYRHeight || rowHeight) ? "".concat(scrollYRHeight || rowHeight, "px") : ''
      },
      attrs: {
        title: showTitle ? $xetable.getCellLabel(row, column) : null
      }
    }, column.renderCell(h, params))]));

    if (showValidTip && hasValidError) {
      tdVNs.push(h('div', {
        class: 'vxe-cell--valid',
        style: validStore.rule && validStore.rule.maxWidth ? {
          width: "".concat(validStore.rule.maxWidth, "px")
        } : null
      }, [h('span', {
        class: 'vxe-cell--valid-msg'
      }, validStore.content)]));
    }
  }

  return h('td', {
    class: ['vxe-body--column', column.id, (_ref2 = {}, _defineProperty(_ref2, "col--".concat(cellAlign), cellAlign), _defineProperty(_ref2, "col--".concat(type), type), _defineProperty(_ref2, 'col--last', $columnIndex === columns.length - 1), _defineProperty(_ref2, 'col--tree-node', treeNode), _defineProperty(_ref2, 'col--edit', isEdit), _defineProperty(_ref2, 'col--ellipsis', hasEllipsis), _defineProperty(_ref2, 'fixed--hidden', fixedHiddenColumn), _defineProperty(_ref2, 'col--dirty', isDirty), _defineProperty(_ref2, 'col--actived', editConfig && isEdit && actived.row === row && (actived.column === column || editOpts.mode === 'row')), _defineProperty(_ref2, 'col--valid-error', hasValidError), _defineProperty(_ref2, 'col--current', currentColumn === column), _ref2), _utils.default.getClass(className, params), _utils.default.getClass(cellClassName, params)],
    key: columnKey || columnOpts.useKey ? column.id : $columnIndex,
    attrs: attrs,
    style: Object.assign({
      height: hasEllipsis && (scrollYRHeight || rowHeight) ? "".concat(scrollYRHeight || rowHeight, "px") : ''
    }, cellStyle ? _xeUtils.default.isFunction(cellStyle) ? cellStyle(params) : cellStyle : null),
    on: tdOns
  }, tdVNs);
}

function renderRows(h, _vm, $xetable, fixedType, tableData, tableColumn) {
  var stripe = $xetable.stripe,
      rowKey = $xetable.rowKey,
      highlightHoverRow = $xetable.highlightHoverRow,
      rowClassName = $xetable.rowClassName,
      rowStyle = $xetable.rowStyle,
      editConfig = $xetable.editConfig,
      allColumnOverflow = $xetable.showOverflow,
      treeConfig = $xetable.treeConfig,
      treeOpts = $xetable.treeOpts,
      editOpts = $xetable.editOpts,
      treeExpandeds = $xetable.treeExpandeds,
      scrollYLoad = $xetable.scrollYLoad,
      editStore = $xetable.editStore,
      rowExpandeds = $xetable.rowExpandeds,
      radioOpts = $xetable.radioOpts,
      checkboxOpts = $xetable.checkboxOpts,
      expandColumn = $xetable.expandColumn,
      hasFixedColumn = $xetable.hasFixedColumn,
      fullAllDataRowIdData = $xetable.fullAllDataRowIdData,
      rowOpts = $xetable.rowOpts;
  var rows = [];
  tableData.forEach(function (row, $rowIndex) {
    var trOn = {};
    var rowIndex = $rowIndex;

    var _rowIndex = $xetable.getVTRowIndex(row); // 确保任何情况下 rowIndex 都精准指向真实 data 索引


    rowIndex = $xetable.getRowIndex(row); // 事件绑定

    if (rowOpts.isHover || highlightHoverRow) {
      trOn.mouseenter = function (evnt) {
        if (isOperateMouse($xetable)) {
          return;
        }

        $xetable.triggerHoverEvent(evnt, {
          row: row,
          rowIndex: rowIndex
        });
      };

      trOn.mouseleave = function () {
        if (isOperateMouse($xetable)) {
          return;
        }

        $xetable.clearHoverRow();
      };
    }

    var rowid = (0, _util.getRowid)($xetable, row);
    var rest = fullAllDataRowIdData[rowid];
    var rowLevel = rest ? rest.level : 0;
    var seq = rest ? rest.seq : -1;
    var params = {
      $table: $xetable,
      seq: seq,
      rowid: rowid,
      fixed: fixedType,
      type: renderType,
      level: rowLevel,
      row: row,
      rowIndex: rowIndex,
      $rowIndex: $rowIndex
    };
    var isNewRow = false;

    if (editConfig) {
      isNewRow = editStore.insertList.indexOf(row) > -1;
    }

    rows.push(h('tr', {
      class: ['vxe-body--row', {
        'row--stripe': stripe && ($xetable.getVTRowIndex(row) + 1) % 2 === 0,
        'is--new': isNewRow,
        'row--new': isNewRow && (editOpts.showStatus || editOpts.showInsertStatus),
        'row--radio': radioOpts.highlight && $xetable.selectRow === row,
        'row--checked': checkboxOpts.highlight && $xetable.isCheckedByCheckboxRow(row)
      }, rowClassName ? _xeUtils.default.isFunction(rowClassName) ? rowClassName(params) : rowClassName : ''],
      attrs: {
        rowid: rowid
      },
      style: rowStyle ? _xeUtils.default.isFunction(rowStyle) ? rowStyle(params) : rowStyle : null,
      key: rowKey || rowOpts.useKey || treeConfig ? rowid : $rowIndex,
      on: trOn
    }, tableColumn.map(function (column, $columnIndex) {
      return renderColumn(h, _vm, $xetable, seq, rowid, fixedType, rowLevel, row, rowIndex, $rowIndex, _rowIndex, column, $columnIndex, tableColumn, tableData);
    }))); // 如果行被展开了

    if (expandColumn && rowExpandeds.length && rowExpandeds.indexOf(row) > -1) {
      var cellStyle;

      if (treeConfig) {
        cellStyle = {
          paddingLeft: "".concat(rowLevel * treeOpts.indent + 30, "px")
        };
      }

      var showOverflow = expandColumn.showOverflow;
      var hasEllipsis = _xeUtils.default.isUndefined(showOverflow) || _xeUtils.default.isNull(showOverflow) ? allColumnOverflow : showOverflow;
      var expandParams = {
        $table: $xetable,
        seq: seq,
        column: expandColumn,
        fixed: fixedType,
        type: renderType,
        level: rowLevel,
        row: row,
        rowIndex: rowIndex,
        $rowIndex: $rowIndex
      };
      rows.push(h('tr', {
        class: 'vxe-body--expanded-row',
        key: "expand_".concat(rowid),
        style: rowStyle ? _xeUtils.default.isFunction(rowStyle) ? rowStyle(expandParams) : rowStyle : null,
        on: trOn
      }, [h('td', {
        class: ['vxe-body--expanded-column', {
          'fixed--hidden': fixedType && !hasFixedColumn,
          'col--ellipsis': hasEllipsis
        }],
        attrs: {
          colspan: tableColumn.length
        }
      }, [h('div', {
        class: 'vxe-body--expanded-cell',
        style: cellStyle
      }, [expandColumn.renderData(h, expandParams)])])]));
    } // 如果是树形表格


    if (treeConfig && !scrollYLoad && !treeOpts.transform && treeExpandeds.length) {
      var rowChildren = row[treeOpts.children];

      if (rowChildren && rowChildren.length && treeExpandeds.indexOf(row) > -1) {
        rows.push.apply(rows, _toConsumableArray(renderRows(h, _vm, $xetable, fixedType, rowChildren, tableColumn)));
      }
    }
  });
  return rows;
}
/**
 * 同步滚动条
 */


var scrollProcessTimeout;

function syncBodyScroll(_vm, fixedType, scrollTop, elem1, elem2) {
  if (elem1 || elem2) {
    if (elem1) {
      (0, _util.removeScrollListener)(elem1);
      elem1.scrollTop = scrollTop;
    }

    if (elem2) {
      (0, _util.removeScrollListener)(elem2);
      elem2.scrollTop = scrollTop;
    }

    clearTimeout(scrollProcessTimeout);
    scrollProcessTimeout = setTimeout(function () {
      // const { tableBody, leftBody, rightBody } = _vm.$refs
      // const bodyElem = tableBody.$el
      // const leftElem = leftBody ? leftBody.$el : null
      // const rightElem = rightBody ? rightBody.$el : null
      (0, _util.restoreScrollListener)(elem1);
      (0, _util.restoreScrollListener)(elem2); // 检查滚动条是的同步
      // let targetTop = bodyElem.scrollTop
      // if (fixedType === 'left') {
      //   if (leftElem) {
      //     targetTop = leftElem.scrollTop
      //   }
      // } else if (fixedType === 'right') {
      //   if (rightElem) {
      //     targetTop = rightElem.scrollTop
      //   }
      // }
      // setScrollTop(bodyElem, targetTop)
      // setScrollTop(leftElem, targetTop)
      // setScrollTop(rightElem, targetTop)
    }, 300);
  }
}

var _default = {
  name: 'VxeTableBody',
  props: {
    tableData: Array,
    tableColumn: Array,
    fixedColumn: Array,
    size: String,
    fixedType: String
  },
  data: function data() {
    return {
      wheelTime: null,
      wheelYSize: 0,
      wheelYInterval: 0,
      wheelYTotal: 0
    };
  },
  mounted: function mounted() {
    var $xetable = this.$parent,
        $el = this.$el,
        $refs = this.$refs,
        fixedType = this.fixedType;
    var elemStore = $xetable.elemStore;
    var prefix = "".concat(fixedType || 'main', "-body-");
    elemStore["".concat(prefix, "wrapper")] = $el;
    elemStore["".concat(prefix, "table")] = $refs.table;
    elemStore["".concat(prefix, "colgroup")] = $refs.colgroup;
    elemStore["".concat(prefix, "list")] = $refs.tbody;
    elemStore["".concat(prefix, "xSpace")] = $refs.xSpace;
    elemStore["".concat(prefix, "ySpace")] = $refs.ySpace;
    elemStore["".concat(prefix, "emptyBlock")] = $refs.emptyBlock;
    this.$el.onscroll = this.scrollEvent;
    this.$el._onscroll = this.scrollEvent;
  },
  beforeDestroy: function beforeDestroy() {
    clearTimeout(this.wheelTime);
    this.$el._onscroll = null;
    this.$el.onscroll = null;
  },
  destroyed: function destroyed() {
    var $xetable = this.$parent,
        fixedType = this.fixedType;
    var elemStore = $xetable.elemStore;
    var prefix = "".concat(fixedType || 'main', "-body-");
    elemStore["".concat(prefix, "wrapper")] = null;
    elemStore["".concat(prefix, "table")] = null;
    elemStore["".concat(prefix, "colgroup")] = null;
    elemStore["".concat(prefix, "list")] = null;
    elemStore["".concat(prefix, "xSpace")] = null;
    elemStore["".concat(prefix, "ySpace")] = null;
    elemStore["".concat(prefix, "emptyBlock")] = null;
  },
  render: function render(h) {
    var _e = this._e,
        $xetable = this.$parent,
        fixedColumn = this.fixedColumn,
        fixedType = this.fixedType;
    var $scopedSlots = $xetable.$scopedSlots,
        tId = $xetable.tId,
        tableData = $xetable.tableData,
        tableColumn = $xetable.tableColumn,
        visibleColumn = $xetable.visibleColumn,
        allColumnOverflow = $xetable.showOverflow,
        keyboardConfig = $xetable.keyboardConfig,
        keyboardOpts = $xetable.keyboardOpts,
        mergeList = $xetable.mergeList,
        spanMethod = $xetable.spanMethod,
        scrollXLoad = $xetable.scrollXLoad,
        scrollYLoad = $xetable.scrollYLoad,
        isAllOverflow = $xetable.isAllOverflow,
        emptyOpts = $xetable.emptyOpts,
        mouseConfig = $xetable.mouseConfig,
        mouseOpts = $xetable.mouseOpts,
        sYOpts = $xetable.sYOpts; // 如果是使用优化模式

    if (fixedType) {
      if (scrollXLoad || scrollYLoad || (allColumnOverflow ? isAllOverflow : allColumnOverflow)) {
        if (!mergeList.length && !spanMethod && !(keyboardConfig && keyboardOpts.isMerge)) {
          tableColumn = fixedColumn;
        } else {
          tableColumn = visibleColumn; // 检查固定列是否被合并，合并范围是否超出固定列
          // if (mergeList.length && !isMergeLeftFixedExceeded && fixedType === 'left') {
          //   tableColumn = fixedColumn
          // } else if (mergeList.length && !isMergeRightFixedExceeded && fixedType === 'right') {
          //   tableColumn = fixedColumn
          // } else {
          //   tableColumn = visibleColumn
          // }
        }
      } else {
        tableColumn = visibleColumn;
      }
    }

    var emptyContent;

    if ($scopedSlots.empty) {
      emptyContent = $scopedSlots.empty.call(this, {
        $table: $xetable
      }, h);
    } else {
      var compConf = emptyOpts.name ? _vXETable.default.renderer.get(emptyOpts.name) : null;
      var renderEmpty = compConf ? compConf.renderEmpty : null;

      if (renderEmpty) {
        emptyContent = renderEmpty.call(this, h, emptyOpts, {
          $table: $xetable
        });
      } else {
        emptyContent = $xetable.emptyText || _conf.default.i18n('vxe.table.emptyText');
      }
    }

    return h('div', {
      class: ['vxe-table--body-wrapper', fixedType ? "fixed-".concat(fixedType, "--wrapper") : 'body--wrapper'],
      attrs: {
        xid: tId
      },
      on: scrollYLoad && sYOpts.mode === 'wheel' ? {
        wheel: this.wheelEvent
      } : {}
    }, [fixedType ? _e() : h('div', {
      class: 'vxe-body--x-space',
      ref: 'xSpace'
    }), h('div', {
      class: 'vxe-body--y-space',
      ref: 'ySpace'
    }), h('table', {
      class: 'vxe-table--body',
      attrs: {
        xid: tId,
        cellspacing: 0,
        cellpadding: 0,
        border: 0
      },
      ref: 'table'
    }, [
    /**
     * 列宽
     */
    h('colgroup', {
      ref: 'colgroup'
    }, tableColumn.map(function (column, $columnIndex) {
      return h('col', {
        attrs: {
          name: column.id
        },
        key: $columnIndex
      });
    })),
    /**
     * 内容
     */
    h('tbody', {
      ref: 'tbody'
    }, renderRows(h, this, $xetable, fixedType, tableData, tableColumn))]), h('div', {
      class: 'vxe-table--checkbox-range'
    }), mouseConfig && mouseOpts.area ? h('div', {
      class: 'vxe-table--cell-area'
    }, [h('span', {
      class: 'vxe-table--cell-main-area'
    }, mouseOpts.extension ? [h('span', {
      class: 'vxe-table--cell-main-area-btn',
      on: {
        mousedown: function mousedown(evnt) {
          $xetable.triggerCellExtendMousedownEvent(evnt, {
            $table: $xetable,
            fixed: fixedType,
            type: renderType
          });
        }
      }
    })] : null), h('span', {
      class: 'vxe-table--cell-copy-area'
    }), h('span', {
      class: 'vxe-table--cell-extend-area'
    }), h('span', {
      class: 'vxe-table--cell-multi-area'
    }), h('span', {
      class: 'vxe-table--cell-active-area'
    })]) : null, !fixedType ? h('div', {
      class: 'vxe-table--empty-block',
      ref: 'emptyBlock'
    }, [h('div', {
      class: 'vxe-table--empty-content'
    }, emptyContent)]) : null]);
  },
  methods: {
    /**
     * 滚动处理
     * 如果存在列固定左侧，同步更新滚动状态
     * 如果存在列固定右侧，同步更新滚动状态
     */
    scrollEvent: function scrollEvent(evnt) {
      var scrollBodyElem = this.$el,
          $xetable = this.$parent,
          fixedType = this.fixedType;
      var $refs = $xetable.$refs,
          elemStore = $xetable.elemStore,
          highlightHoverRow = $xetable.highlightHoverRow,
          scrollXLoad = $xetable.scrollXLoad,
          scrollYLoad = $xetable.scrollYLoad,
          lastScrollTop = $xetable.lastScrollTop,
          lastScrollLeft = $xetable.lastScrollLeft,
          rowOpts = $xetable.rowOpts;
      var tableHeader = $refs.tableHeader,
          tableBody = $refs.tableBody,
          leftBody = $refs.leftBody,
          rightBody = $refs.rightBody,
          tableFooter = $refs.tableFooter,
          validTip = $refs.validTip;
      var headerElem = tableHeader ? tableHeader.$el : null;
      var footerElem = tableFooter ? tableFooter.$el : null;
      var bodyElem = tableBody.$el;
      var leftElem = leftBody ? leftBody.$el : null;
      var rightElem = rightBody ? rightBody.$el : null;
      var bodyYElem = elemStore['main-body-ySpace'];
      var bodyXElem = elemStore['main-body-xSpace'];
      var bodyHeight = scrollYLoad && bodyYElem ? bodyYElem.clientHeight : bodyElem.clientHeight;
      var bodyWidth = scrollXLoad && bodyXElem ? bodyXElem.clientWidth : bodyElem.clientWidth;
      var scrollTop = scrollBodyElem.scrollTop;
      var scrollLeft = bodyElem.scrollLeft;
      var isRollX = scrollLeft !== lastScrollLeft;
      var isRollY = scrollTop !== lastScrollTop;
      $xetable.lastScrollTop = scrollTop;
      $xetable.lastScrollLeft = scrollLeft;
      $xetable.lastScrollTime = Date.now();

      if (rowOpts.isHover || highlightHoverRow) {
        $xetable.clearHoverRow();
      }

      if (leftElem && fixedType === 'left') {
        scrollTop = leftElem.scrollTop;
        syncBodyScroll($xetable, fixedType, scrollTop, bodyElem, rightElem);
      } else if (rightElem && fixedType === 'right') {
        scrollTop = rightElem.scrollTop;
        syncBodyScroll($xetable, fixedType, scrollTop, bodyElem, leftElem);
      } else {
        if (isRollX) {
          if (headerElem) {
            headerElem.scrollLeft = bodyElem.scrollLeft;
          }

          if (footerElem) {
            footerElem.scrollLeft = bodyElem.scrollLeft;
          }
        }

        if (leftElem || rightElem) {
          $xetable.checkScrolling();

          if (isRollY) {
            syncBodyScroll($xetable, fixedType, scrollTop, leftElem, rightElem);
          }
        }
      }

      if (scrollXLoad && isRollX) {
        $xetable.triggerScrollXEvent(evnt);
      }

      if (scrollYLoad && isRollY) {
        $xetable.triggerScrollYEvent(evnt);
      }

      if (isRollX && validTip && validTip.visible) {
        validTip.updatePlacement();
      }

      $xetable.emitEvent('scroll', {
        type: renderType,
        fixed: fixedType,
        scrollTop: scrollTop,
        scrollLeft: scrollLeft,
        scrollHeight: bodyElem.scrollHeight,
        scrollWidth: bodyElem.scrollWidth,
        bodyHeight: bodyHeight,
        bodyWidth: bodyWidth,
        isX: isRollX,
        isY: isRollY
      }, evnt);
    },
    handleWheel: function handleWheel(evnt, isTopWheel, deltaTop, isRollX, isRollY) {
      var _this = this;

      var $xetable = this.$parent;
      var $refs = $xetable.$refs,
          elemStore = $xetable.elemStore,
          scrollYLoad = $xetable.scrollYLoad,
          scrollXLoad = $xetable.scrollXLoad;
      var tableBody = $refs.tableBody,
          leftBody = $refs.leftBody,
          rightBody = $refs.rightBody;
      var bodyElem = tableBody.$el;
      var leftElem = leftBody ? leftBody.$el : null;
      var rightElem = rightBody ? rightBody.$el : null;
      var remainSize = this.isPrevWheelTop === isTopWheel ? Math.max(0, this.wheelYSize - this.wheelYTotal) : 0;
      var bodyYElem = elemStore['main-body-ySpace'];
      var bodyXElem = elemStore['main-body-xSpace'];
      var bodyHeight = scrollYLoad && bodyYElem ? bodyYElem.clientHeight : bodyElem.clientHeight;
      var bodyWidth = scrollXLoad && bodyXElem ? bodyXElem.clientWidth : bodyElem.clientWidth;
      this.isPrevWheelTop = isTopWheel;
      this.wheelYSize = Math.abs(isTopWheel ? deltaTop - remainSize : deltaTop + remainSize);
      this.wheelYInterval = 0;
      this.wheelYTotal = 0;
      clearTimeout(this.wheelTime);

      var handleSmooth = function handleSmooth() {
        var fixedType = _this.fixedType,
            wheelYTotal = _this.wheelYTotal,
            wheelYSize = _this.wheelYSize,
            wheelYInterval = _this.wheelYInterval;

        if (wheelYTotal < wheelYSize) {
          wheelYInterval = Math.max(5, Math.floor(wheelYInterval * 1.5));
          wheelYTotal = wheelYTotal + wheelYInterval;

          if (wheelYTotal > wheelYSize) {
            wheelYInterval = wheelYInterval - (wheelYTotal - wheelYSize);
          }

          var scrollTop = bodyElem.scrollTop,
              clientHeight = bodyElem.clientHeight,
              scrollHeight = bodyElem.scrollHeight;
          var targetTop = scrollTop + wheelYInterval * (isTopWheel ? -1 : 1);
          bodyElem.scrollTop = targetTop;

          if (leftElem) {
            leftElem.scrollTop = targetTop;
          }

          if (rightElem) {
            rightElem.scrollTop = targetTop;
          }

          if (isTopWheel ? targetTop < scrollHeight - clientHeight : targetTop >= 0) {
            _this.wheelTime = setTimeout(handleSmooth, 10);
          }

          _this.wheelYTotal = wheelYTotal;
          _this.wheelYInterval = wheelYInterval;
          $xetable.emitEvent('scroll', {
            type: renderType,
            fixed: fixedType,
            scrollTop: bodyElem.scrollTop,
            scrollLeft: bodyElem.scrollLeft,
            scrollHeight: bodyElem.scrollHeight,
            scrollWidth: bodyElem.scrollWidth,
            bodyHeight: bodyHeight,
            bodyWidth: bodyWidth,
            isX: isRollX,
            isY: isRollY
          }, evnt);
        }
      };

      handleSmooth();
    },

    /**
     * 滚轮处理
     */
    wheelEvent: function wheelEvent(evnt) {
      var deltaY = evnt.deltaY,
          deltaX = evnt.deltaX;
      var scrollBodyElem = this.$el,
          $xetable = this.$parent;
      var $refs = $xetable.$refs,
          highlightHoverRow = $xetable.highlightHoverRow,
          scrollYLoad = $xetable.scrollYLoad,
          lastScrollTop = $xetable.lastScrollTop,
          lastScrollLeft = $xetable.lastScrollLeft,
          rowOpts = $xetable.rowOpts;
      var tableBody = $refs.tableBody;
      var bodyElem = tableBody.$el;
      var deltaTop = deltaY;
      var deltaLeft = deltaX;
      var isTopWheel = deltaTop < 0; // 如果滚动位置已经是顶部或底部，则不需要触发

      if (isTopWheel ? scrollBodyElem.scrollTop <= 0 : scrollBodyElem.scrollTop >= scrollBodyElem.scrollHeight - scrollBodyElem.clientHeight) {
        return;
      }

      var scrollTop = scrollBodyElem.scrollTop + deltaTop;
      var scrollLeft = bodyElem.scrollLeft + deltaLeft;
      var isRollX = scrollLeft !== lastScrollLeft;
      var isRollY = scrollTop !== lastScrollTop; // 用于鼠标纵向滚轮处理

      if (isRollY) {
        evnt.preventDefault();
        $xetable.lastScrollTop = scrollTop;
        $xetable.lastScrollLeft = scrollLeft;
        $xetable.lastScrollTime = Date.now();

        if (rowOpts.isHover || highlightHoverRow) {
          $xetable.clearHoverRow();
        }

        this.handleWheel(evnt, isTopWheel, deltaTop, isRollX, isRollY);

        if (scrollYLoad) {
          $xetable.triggerScrollYEvent(evnt);
        }
      }
    }
  }
};
exports.default = _default;