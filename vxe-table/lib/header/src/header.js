"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _utils = _interopRequireDefault(require("../../tools/utils"));

var _dom = _interopRequireDefault(require("../../tools/dom"));

var _util = require("./util");

var _util2 = require("../../table/src/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var cellType = 'header';
var _default = {
  name: 'VxeTableHeader',
  props: {
    tableData: Array,
    tableColumn: Array,
    tableGroupColumn: Array,
    fixedColumn: Array,
    size: String,
    fixedType: String
  },
  data: function data() {
    return {
      headerColumn: []
    };
  },
  watch: {
    tableColumn: function tableColumn() {
      this.uploadColumn();
    }
  },
  created: function created() {
    this.uploadColumn();
  },
  mounted: function mounted() {
    var $xetable = this.$parent,
        $el = this.$el,
        $refs = this.$refs,
        fixedType = this.fixedType;
    var elemStore = $xetable.elemStore;
    var prefix = "".concat(fixedType || 'main', "-header-");
    elemStore["".concat(prefix, "wrapper")] = $el;
    elemStore["".concat(prefix, "table")] = $refs.table;
    elemStore["".concat(prefix, "colgroup")] = $refs.colgroup;
    elemStore["".concat(prefix, "list")] = $refs.thead;
    elemStore["".concat(prefix, "xSpace")] = $refs.xSpace;
    elemStore["".concat(prefix, "repair")] = $refs.repair;
  },
  destroyed: function destroyed() {
    var $xetable = this.$parent,
        fixedType = this.fixedType;
    var elemStore = $xetable.elemStore;
    var prefix = "".concat(fixedType || 'main', "-header-");
    elemStore["".concat(prefix, "wrapper")] = null;
    elemStore["".concat(prefix, "table")] = null;
    elemStore["".concat(prefix, "colgroup")] = null;
    elemStore["".concat(prefix, "list")] = null;
    elemStore["".concat(prefix, "xSpace")] = null;
    elemStore["".concat(prefix, "repair")] = null;
  },
  render: function render(h) {
    var _this = this;

    var _e = this._e,
        $xetable = this.$parent,
        fixedType = this.fixedType,
        headerColumn = this.headerColumn,
        fixedColumn = this.fixedColumn;
    var tableListeners = $xetable.$listeners,
        tId = $xetable.tId,
        isGroup = $xetable.isGroup,
        resizable = $xetable.resizable,
        border = $xetable.border,
        columnKey = $xetable.columnKey,
        headerRowClassName = $xetable.headerRowClassName,
        headerCellClassName = $xetable.headerCellClassName,
        headerRowStyle = $xetable.headerRowStyle,
        headerCellStyle = $xetable.headerCellStyle,
        allColumnHeaderOverflow = $xetable.showHeaderOverflow,
        allHeaderAlign = $xetable.headerAlign,
        allAlign = $xetable.align,
        highlightCurrentColumn = $xetable.highlightCurrentColumn,
        currentColumn = $xetable.currentColumn,
        scrollXLoad = $xetable.scrollXLoad,
        overflowX = $xetable.overflowX,
        scrollbarWidth = $xetable.scrollbarWidth,
        sortOpts = $xetable.sortOpts,
        mouseConfig = $xetable.mouseConfig,
        columnOpts = $xetable.columnOpts;
    var tableColumn = this.tableColumn;
    var headerGroups = headerColumn; // 如果是使用优化模式

    if (!isGroup) {
      if (fixedType) {
        if (scrollXLoad || allColumnHeaderOverflow) {
          tableColumn = fixedColumn;
        }
      }

      headerGroups = [tableColumn];
    }

    return h('div', {
      class: ['vxe-table--header-wrapper', fixedType ? "fixed-".concat(fixedType, "--wrapper") : 'body--wrapper'],
      attrs: {
        xid: tId
      }
    }, [fixedType ? _e() : h('div', {
      class: 'vxe-body--x-space',
      ref: 'xSpace'
    }), h('table', {
      class: 'vxe-table--header',
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
    }).concat(scrollbarWidth ? [h('col', {
      attrs: {
        name: 'col_gutter'
      }
    })] : [])),
    /**
     * 头部
     */
    h('thead', {
      ref: 'thead'
    }, headerGroups.map(function (cols, $rowIndex) {
      return h('tr', {
        class: ['vxe-header--row', headerRowClassName ? _xeUtils.default.isFunction(headerRowClassName) ? headerRowClassName({
          $table: $xetable,
          $rowIndex: $rowIndex,
          fixed: fixedType,
          type: cellType
        }) : headerRowClassName : ''],
        style: headerRowStyle ? _xeUtils.default.isFunction(headerRowStyle) ? headerRowStyle({
          $table: $xetable,
          $rowIndex: $rowIndex,
          fixed: fixedType,
          type: cellType
        }) : headerRowStyle : null
      }, cols.map(function (column, $columnIndex) {
        var _ref;

        var type = column.type,
            showHeaderOverflow = column.showHeaderOverflow,
            headerAlign = column.headerAlign,
            align = column.align,
            headerClassName = column.headerClassName; // const { enabled } = tooltipOpts

        var isColGroup = column.children && column.children.length;
        var fixedHiddenColumn = fixedType ? column.fixed !== fixedType && !isColGroup : column.fixed && overflowX;
        var headOverflow = _xeUtils.default.isUndefined(showHeaderOverflow) || _xeUtils.default.isNull(showHeaderOverflow) ? allColumnHeaderOverflow : showHeaderOverflow;
        var headAlign = headerAlign || align || allHeaderAlign || allAlign;
        var showEllipsis = headOverflow === 'ellipsis';
        var showTitle = headOverflow === 'title';
        var showTooltip = headOverflow === true || headOverflow === 'tooltip';
        var hasEllipsis = showTitle || showTooltip || showEllipsis;
        var thOns = {};
        var hasFilter = column.filters && column.filters.some(function (item) {
          return item.checked;
        });
        var columnIndex = $xetable.getColumnIndex(column);

        var _columnIndex = $xetable.getVTColumnIndex(column);

        var params = {
          $table: $xetable,
          $rowIndex: $rowIndex,
          column: column,
          columnIndex: columnIndex,
          $columnIndex: $columnIndex,
          _columnIndex: _columnIndex,
          fixed: fixedType,
          type: cellType,
          isHidden: fixedHiddenColumn,
          hasFilter: hasFilter
        }; // 虚拟滚动不支持动态高度

        if (scrollXLoad && !hasEllipsis) {
          showEllipsis = hasEllipsis = true;
        }

        if (columnOpts.isCurrent || highlightCurrentColumn || tableListeners['header-cell-click'] || sortOpts.trigger === 'cell') {
          thOns.click = function (evnt) {
            return $xetable.triggerHeaderCellClickEvent(evnt, params);
          };
        }

        if (tableListeners['header-cell-dblclick']) {
          thOns.dblclick = function (evnt) {
            return $xetable.triggerHeaderCellDblclickEvent(evnt, params);
          };
        } // 按下事件处理


        if (mouseConfig) {
          thOns.mousedown = function (evnt) {
            return $xetable.triggerHeaderCellMousedownEvent(evnt, params);
          };
        }

        return h('th', {
          class: ['vxe-header--column', column.id, (_ref = {}, _defineProperty(_ref, "col--".concat(headAlign), headAlign), _defineProperty(_ref, "col--".concat(type), type), _defineProperty(_ref, 'col--last', $columnIndex === cols.length - 1), _defineProperty(_ref, 'col--fixed', column.fixed), _defineProperty(_ref, 'col--group', isColGroup), _defineProperty(_ref, 'col--ellipsis', hasEllipsis), _defineProperty(_ref, 'fixed--hidden', fixedHiddenColumn), _defineProperty(_ref, 'is--sortable', column.sortable), _defineProperty(_ref, 'col--filter', !!column.filters), _defineProperty(_ref, 'is--filter-active', hasFilter), _defineProperty(_ref, 'col--current', currentColumn === column), _ref), _utils.default.getClass(headerClassName, params), _utils.default.getClass(headerCellClassName, params)],
          attrs: {
            colid: column.id,
            colspan: column.colSpan > 1 ? column.colSpan : null,
            rowspan: column.rowSpan > 1 ? column.rowSpan : null
          },
          style: headerCellStyle ? _xeUtils.default.isFunction(headerCellStyle) ? headerCellStyle(params) : headerCellStyle : null,
          on: thOns,
          key: columnKey || columnOpts.useKey || isColGroup ? column.id : $columnIndex
        }, [h('div', {
          class: ['vxe-cell', {
            'c--title': showTitle,
            'c--tooltip': showTooltip,
            'c--ellipsis': showEllipsis
          }]
        }, column.renderHeader(h, params)),
        /**
         * 列宽拖动
         */
        !fixedHiddenColumn && !isColGroup && (_xeUtils.default.isBoolean(column.resizable) ? column.resizable : columnOpts.resizable || resizable) ? h('div', {
          class: ['vxe-resizable', {
            'is--line': !border || border === 'none'
          }],
          on: {
            mousedown: function mousedown(evnt) {
              return _this.resizeMousedown(evnt, params);
            }
          }
        }) : null]);
      }).concat(scrollbarWidth ? [h('th', {
        class: 'vxe-header--gutter col--gutter'
      })] : []));
    }))]),
    /**
     * 其他
     */
    h('div', {
      class: 'vxe-table--header-border-line',
      ref: 'repair'
    })]);
  },
  methods: {
    uploadColumn: function uploadColumn() {
      var $xetable = this.$parent;
      this.headerColumn = $xetable.isGroup ? (0, _util.convertToRows)(this.tableGroupColumn) : [];
    },
    resizeMousedown: function resizeMousedown(evnt, params) {
      var column = params.column;
      var $xetable = this.$parent,
          $el = this.$el,
          fixedType = this.fixedType;
      var _$xetable$$refs = $xetable.$refs,
          tableBody = _$xetable$$refs.tableBody,
          leftContainer = _$xetable$$refs.leftContainer,
          rightContainer = _$xetable$$refs.rightContainer,
          resizeBarElem = _$xetable$$refs.resizeBar;
      var dragBtnElem = evnt.target,
          dragClientX = evnt.clientX;
      var cell = params.cell = dragBtnElem.parentNode;
      var dragLeft = 0;
      var tableBodyElem = tableBody.$el;

      var pos = _dom.default.getOffsetPos(dragBtnElem, $el);

      var dragBtnWidth = dragBtnElem.clientWidth;
      var dragBtnOffsetWidth = Math.floor(dragBtnWidth / 2);
      var minInterval = (0, _util2.getColMinWidth)(params) - dragBtnOffsetWidth; // 列之间的最小间距

      var dragMinLeft = pos.left - cell.clientWidth + dragBtnWidth + minInterval;
      var dragPosLeft = pos.left + dragBtnOffsetWidth;
      var domMousemove = document.onmousemove;
      var domMouseup = document.onmouseup;
      var isLeftFixed = fixedType === 'left';
      var isRightFixed = fixedType === 'right'; // 计算左右侧固定列偏移量

      var fixedOffsetWidth = 0;

      if (isLeftFixed || isRightFixed) {
        var siblingProp = isLeftFixed ? 'nextElementSibling' : 'previousElementSibling';
        var tempCellElem = cell[siblingProp];

        while (tempCellElem) {
          if (_dom.default.hasClass(tempCellElem, 'fixed--hidden')) {
            break;
          } else if (!_dom.default.hasClass(tempCellElem, 'col--group')) {
            fixedOffsetWidth += tempCellElem.offsetWidth;
          }

          tempCellElem = tempCellElem[siblingProp];
        }

        if (isRightFixed && rightContainer) {
          dragPosLeft = rightContainer.offsetLeft + fixedOffsetWidth;
        }
      } // 处理拖动事件


      var updateEvent = function updateEvent(evnt) {
        evnt.stopPropagation();
        evnt.preventDefault();
        var offsetX = evnt.clientX - dragClientX;
        var left = dragPosLeft + offsetX;
        var scrollLeft = fixedType ? 0 : tableBodyElem.scrollLeft;

        if (isLeftFixed) {
          // 左固定列（不允许超过右侧固定列、不允许超过右边距）
          left = Math.min(left, (rightContainer ? rightContainer.offsetLeft : tableBodyElem.clientWidth) - fixedOffsetWidth - minInterval);
        } else if (isRightFixed) {
          // 右侧固定列（不允许超过左侧固定列、不允许超过左边距）
          dragMinLeft = (leftContainer ? leftContainer.clientWidth : 0) + fixedOffsetWidth + minInterval;
          left = Math.min(left, dragPosLeft + cell.clientWidth - minInterval);
        } else {
          dragMinLeft = Math.max(tableBodyElem.scrollLeft, dragMinLeft); // left = Math.min(left, tableBodyElem.clientWidth + tableBodyElem.scrollLeft - 40)
        }

        dragLeft = Math.max(left, dragMinLeft);
        resizeBarElem.style.left = "".concat(dragLeft - scrollLeft, "px");
      };

      $xetable._isResize = true;

      _dom.default.addClass($xetable.$el, 'drag--resize');

      resizeBarElem.style.display = 'block';
      document.onmousemove = updateEvent;

      document.onmouseup = function (evnt) {
        document.onmousemove = domMousemove;
        document.onmouseup = domMouseup;
        column.resizeWidth = column.renderWidth + (isRightFixed ? dragPosLeft - dragLeft : dragLeft - dragPosLeft);
        resizeBarElem.style.display = 'none';
        $xetable._isResize = false;
        $xetable._lastResizeTime = Date.now();
        $xetable.analyColumnWidth();
        $xetable.recalculate(true).then(function () {
          $xetable.saveCustomResizable();
          $xetable.updateCellAreas();
          $xetable.emitEvent('resizable-change', params, evnt);
        });

        _dom.default.removeClass($xetable.$el, 'drag--resize');
      };

      updateEvent(evnt);
      $xetable.closeMenu();
    }
  }
};
exports.default = _default;