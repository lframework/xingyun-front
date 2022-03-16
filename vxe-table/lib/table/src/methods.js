"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _cell = _interopRequireDefault(require("./cell"));

var _vXETable = _interopRequireDefault(require("../../v-x-e-table"));

var _util = require("./util");

var _utils = _interopRequireWildcard(require("../../tools/utils"));

var _dom = _interopRequireWildcard(require("../../tools/dom"));

var _formats = require("../../v-x-e-table/src/formats");

var _log = require("../../tools/log");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var setCellValue = _utils.default.setCellValue,
    hasChildrenList = _utils.default.hasChildrenList,
    getColumnList = _utils.default.getColumnList;
var calcHeight = _dom.default.calcHeight,
    hasClass = _dom.default.hasClass,
    addClass = _dom.default.addClass,
    removeClass = _dom.default.removeClass,
    getEventTargetNode = _dom.default.getEventTargetNode,
    isNodeElement = _dom.default.isNodeElement;
var isWebkit = _dom.browse['-webkit'] && !_dom.browse.edge;
var debounceScrollYDuration = _dom.browse.msie ? 80 : 20;
var resizableStorageKey = 'VXE_TABLE_CUSTOM_COLUMN_WIDTH';
var visibleStorageKey = 'VXE_TABLE_CUSTOM_COLUMN_VISIBLE';
/**
 * 生成行的唯一主键
 */

function getRowUniqueId() {
  return _xeUtils.default.uniqueId('row_');
}

function eqCellValue(row1, row2, field) {
  var val1 = _xeUtils.default.get(row1, field);

  var val2 = _xeUtils.default.get(row2, field);

  if ((0, _utils.eqEmptyValue)(val1) && (0, _utils.eqEmptyValue)(val2)) {
    return true;
  }

  if (_xeUtils.default.isString(val1) || _xeUtils.default.isNumber(val1)) {
    return '' + val1 === '' + val2;
  }

  return _xeUtils.default.isEqual(val1, val2);
}

function getNextSortOrder(_vm, column) {
  var orders = _vm.sortOpts.orders;
  var currOrder = column.order || null;
  var oIndex = orders.indexOf(currOrder) + 1;
  return orders[oIndex < orders.length ? oIndex : 0];
}

function getCustomStorageMap(key) {
  var version = _conf.default.version;

  var rest = _xeUtils.default.toStringJSON(localStorage.getItem(key));

  return rest && rest._v === version ? rest : {
    _v: version
  };
}

function getRecoverRow(_vm, list) {
  var fullAllDataRowMap = _vm.fullAllDataRowMap;
  return list.filter(function (row) {
    return fullAllDataRowMap.has(row);
  });
}

function handleReserveRow(_vm, reserveRowMap) {
  var fullDataRowIdData = _vm.fullDataRowIdData;
  var reserveList = [];

  _xeUtils.default.each(reserveRowMap, function (item, rowid) {
    if (fullDataRowIdData[rowid] && reserveList.indexOf(fullDataRowIdData[rowid].row) === -1) {
      reserveList.push(fullDataRowIdData[rowid].row);
    }
  });

  return reserveList;
}

function computeVirtualX(_vm) {
  var $refs = _vm.$refs,
      visibleColumn = _vm.visibleColumn;
  var tableBody = $refs.tableBody;
  var tableBodyElem = tableBody ? tableBody.$el : null;

  if (tableBodyElem) {
    var scrollLeft = tableBodyElem.scrollLeft,
        clientWidth = tableBodyElem.clientWidth;
    var endWidth = scrollLeft + clientWidth;
    var toVisibleIndex = -1;
    var cWidth = 0;
    var visibleSize = 0;

    for (var colIndex = 0, colLen = visibleColumn.length; colIndex < colLen; colIndex++) {
      cWidth += visibleColumn[colIndex].renderWidth;

      if (toVisibleIndex === -1 && scrollLeft < cWidth) {
        toVisibleIndex = colIndex;
      }

      if (toVisibleIndex >= 0) {
        visibleSize++;

        if (cWidth > endWidth) {
          break;
        }
      }
    }

    return {
      toVisibleIndex: Math.max(0, toVisibleIndex),
      visibleSize: Math.max(8, visibleSize)
    };
  }

  return {
    toVisibleIndex: 0,
    visibleSize: 8
  };
}

function computeVirtualY(_vm) {
  var $refs = _vm.$refs,
      vSize = _vm.vSize,
      rowHeightMaps = _vm.rowHeightMaps;
  var tableHeader = $refs.tableHeader,
      tableBody = $refs.tableBody;
  var tableBodyElem = tableBody ? tableBody.$el : null;

  if (tableBodyElem) {
    var tableHeaderElem = tableHeader ? tableHeader.$el : null;
    var rowHeight = 0;
    var firstTrElem;
    firstTrElem = tableBodyElem.querySelector('tr');

    if (!firstTrElem && tableHeaderElem) {
      firstTrElem = tableHeaderElem.querySelector('tr');
    }

    if (firstTrElem) {
      rowHeight = firstTrElem.clientHeight;
    }

    if (!rowHeight) {
      rowHeight = rowHeightMaps[vSize || 'default'];
    }

    var visibleSize = Math.max(8, Math.ceil(tableBodyElem.clientHeight / rowHeight) + 2);
    return {
      rowHeight: rowHeight,
      visibleSize: visibleSize
    };
  }

  return {
    rowHeight: 0,
    visibleSize: 8
  };
}

function calculateMergerOffserIndex(list, offsetItem, type) {
  for (var mcIndex = 0, len = list.length; mcIndex < len; mcIndex++) {
    var mergeItem = list[mcIndex];
    var startIndex = offsetItem.startIndex,
        endIndex = offsetItem.endIndex;
    var mergeStartIndex = mergeItem[type];
    var mergeSpanNumber = mergeItem[type + 'span'];
    var mergeEndIndex = mergeStartIndex + mergeSpanNumber;

    if (mergeStartIndex < startIndex && startIndex < mergeEndIndex) {
      offsetItem.startIndex = mergeStartIndex;
    }

    if (mergeStartIndex < endIndex && endIndex < mergeEndIndex) {
      offsetItem.endIndex = mergeEndIndex;
    }

    if (offsetItem.startIndex !== startIndex || offsetItem.endIndex !== endIndex) {
      mcIndex = -1;
    }
  }
}

function setMerges(_vm, merges, mList, rowList) {
  if (merges) {
    var treeConfig = _vm.treeConfig,
        visibleColumn = _vm.visibleColumn;

    if (treeConfig) {
      throw new Error(_utils.default.getLog('vxe.error.noTree', ['merge-footer-items']));
    }

    if (!_xeUtils.default.isArray(merges)) {
      merges = [merges];
    }

    merges.forEach(function (item) {
      var row = item.row,
          col = item.col,
          rowspan = item.rowspan,
          colspan = item.colspan;

      if (rowList && _xeUtils.default.isNumber(row)) {
        row = rowList[row];
      }

      if (_xeUtils.default.isNumber(col)) {
        col = visibleColumn[col];
      }

      if ((rowList ? row : _xeUtils.default.isNumber(row)) && col && (rowspan || colspan)) {
        rowspan = _xeUtils.default.toNumber(rowspan) || 1;
        colspan = _xeUtils.default.toNumber(colspan) || 1;

        if (rowspan > 1 || colspan > 1) {
          var mcIndex = _xeUtils.default.findIndexOf(mList, function (item) {
            return item._row === row && item._col === col;
          });

          var mergeItem = mList[mcIndex];

          if (mergeItem) {
            mergeItem.rowspan = rowspan;
            mergeItem.colspan = colspan;
            mergeItem._rowspan = rowspan;
            mergeItem._colspan = colspan;
          } else {
            var mergeRowIndex = rowList ? rowList.indexOf(row) : row;
            var mergeColIndex = visibleColumn.indexOf(col);
            mList.push({
              row: mergeRowIndex,
              col: mergeColIndex,
              rowspan: rowspan,
              colspan: colspan,
              _row: row,
              _col: col,
              _rowspan: rowspan,
              _colspan: colspan
            });
          }
        }
      }
    });
  }
}

function removeMerges(_vm, merges, mList, rowList) {
  var rest = [];

  if (merges) {
    var treeConfig = _vm.treeConfig,
        visibleColumn = _vm.visibleColumn;

    if (treeConfig) {
      throw new Error(_utils.default.getLog('vxe.error.noTree', ['merge-cells']));
    }

    if (!_xeUtils.default.isArray(merges)) {
      merges = [merges];
    }

    merges.forEach(function (item) {
      var row = item.row,
          col = item.col;

      if (rowList && _xeUtils.default.isNumber(row)) {
        row = rowList[row];
      }

      if (_xeUtils.default.isNumber(col)) {
        col = visibleColumn[col];
      }

      var mcIndex = _xeUtils.default.findIndexOf(mList, function (item) {
        return item._row === row && item._col === col;
      });

      if (mcIndex > -1) {
        var rItems = mList.splice(mcIndex, 1);
        rest.push(rItems[0]);
      }
    });
  }

  return rest;
}

function clearAllSort(_vm) {
  _vm.tableFullColumn.forEach(function (column) {
    column.order = null;
  });
}

function getOrderField(_vm, column) {
  var sortBy = column.sortBy,
      sortType = column.sortType;
  return function (row) {
    var cellValue;

    if (sortBy) {
      cellValue = _xeUtils.default.isFunction(sortBy) ? sortBy({
        row: row,
        column: column
      }) : _xeUtils.default.get(row, sortBy);
    } else {
      cellValue = _vm.getCellLabel(row, column);
    }

    if (!sortType || sortType === 'auto') {
      return isNaN(cellValue) ? cellValue : _xeUtils.default.toNumber(cellValue);
    } else if (sortType === 'number') {
      return _xeUtils.default.toNumber(cellValue);
    } else if (sortType === 'string') {
      return _xeUtils.default.toValueString(cellValue);
    }

    return cellValue;
  };
}

var Methods = {
  callSlot: function callSlot(slotFunc, params, h, vNodes) {
    if (slotFunc) {
      var $xegrid = this.$xegrid;

      if ($xegrid) {
        return $xegrid.callSlot(slotFunc, params, h, vNodes);
      }

      if (_xeUtils.default.isFunction(slotFunc)) {
        return slotFunc.call(this, params, h, vNodes);
      }
    }

    return [];
  },

  /**
   * 获取父容器元素
   */
  getParentElem: function getParentElem() {
    var $el = this.$el,
        $xegrid = this.$xegrid;
    return $xegrid ? $xegrid.$el.parentNode : $el.parentNode;
  },

  /**
   * 获取父容器的高度
   */
  getParentHeight: function getParentHeight() {
    var $el = this.$el,
        $xegrid = this.$xegrid,
        height = this.height;
    var parentElem = $el.parentNode;
    var parentPaddingSize = height === 'auto' ? (0, _dom.getPaddingTopBottomSize)(parentElem) : 0;
    return Math.floor($xegrid ? $xegrid.getParentHeight() : _xeUtils.default.toNumber(getComputedStyle(parentElem).height) - parentPaddingSize);
  },

  /**
   * 获取需要排除的高度
   * 但渲染表格高度时，需要排除工具栏或分页等相关组件的高度
   * 如果存在表尾合计滚动条，则需要排除滚动条高度
   */
  getExcludeHeight: function getExcludeHeight() {
    var $xegrid = this.$xegrid;
    return $xegrid ? $xegrid.getExcludeHeight() : 0;
  },

  /**
   * 重置表格的一切数据状态
   */
  clearAll: function clearAll() {
    return (0, _util.clearTableAllStatus)(this);
  },

  /**
   * 同步 data 数据（即将废弃）
   * 如果用了该方法，那么组件将不再记录增删改的状态，只能自行实现对应逻辑
   * 对于某些特殊的场景，比如深层树节点元素发生变动时可能会用到
   */
  syncData: function syncData() {
    var _this = this;

    return this.$nextTick().then(function () {
      _this.tableData = [];
      return _this.$nextTick().then(function () {
        return _this.loadTableData(_this.tableFullData);
      });
    });
  },

  /**
   * 手动处理数据，用于手动排序与筛选
   * 对于手动更改了排序、筛选...等条件后需要重新处理数据时可能会用到
   */
  updateData: function updateData() {
    var _this2 = this;

    var scrollXLoad = this.scrollXLoad,
        scrollYLoad = this.scrollYLoad;
    return this.handleTableData(true).then(function () {
      _this2.updateFooter();

      _this2.checkSelectionStatus();

      if (scrollXLoad || scrollYLoad) {
        if (scrollXLoad) {
          _this2.updateScrollXSpace();
        }

        if (scrollYLoad) {
          _this2.updateScrollYSpace();
        }

        return _this2.refreshScroll();
      }
    }).then(function () {
      _this2.updateCellAreas();

      return _this2.recalculate(true);
    }).then(function () {
      // 存在滚动行为未结束情况
      setTimeout(function () {
        return _this2.recalculate();
      }, 50);
    });
  },
  handleTableData: function handleTableData(force) {
    var _this3 = this;

    var scrollYLoad = this.scrollYLoad,
        scrollYStore = this.scrollYStore,
        fullDataRowIdData = this.fullDataRowIdData,
        afterFullData = this.afterFullData;
    var fullList = afterFullData; // 是否进行数据处理

    if (force) {
      // 更新数据，处理筛选和排序
      this.updateAfterFullData(); // 如果为虚拟树，将树结构拍平

      fullList = this.handleVirtualTreeToList();
    }

    var tableData = scrollYLoad ? fullList.slice(scrollYStore.startIndex, scrollYStore.endIndex) : fullList.slice(0);
    tableData.forEach(function (row, $index) {
      var rowid = (0, _util.getRowid)(_this3, row);
      var rest = fullDataRowIdData[rowid];

      if (rest) {
        rest.$index = $index;
      }
    });
    this.tableData = tableData;
    return this.$nextTick();
  },
  updateScrollYStatus: function updateScrollYStatus(fullData) {
    var treeConfig = this.treeConfig,
        treeOpts = this.treeOpts,
        sYOpts = this.sYOpts;
    var transform = treeOpts.transform;
    var scrollYLoad = (transform || !treeConfig) && !!sYOpts.enabled && sYOpts.gt > -1 && sYOpts.gt < fullData.length;
    this.scrollYLoad = scrollYLoad;
    return scrollYLoad;
  },

  /**
   * 加载表格数据
   * @param {Array} datas 数据
   */
  loadTableData: function loadTableData(datas) {
    var _this4 = this;

    var keepSource = this.keepSource,
        treeConfig = this.treeConfig,
        treeOpts = this.treeOpts,
        editStore = this.editStore,
        scrollYStore = this.scrollYStore,
        scrollXStore = this.scrollXStore,
        lastScrollLeft = this.lastScrollLeft,
        lastScrollTop = this.lastScrollTop,
        oldScrollYLoad = this.scrollYLoad;
    var treeData = [];
    var fullData = datas ? datas.slice(0) : [];

    if (treeConfig) {
      // 树结构自动转换
      if (treeOpts.transform) {
        if (process.env.NODE_ENV === 'development') {
          if (!treeOpts.rowField) {
            (0, _log.errLog)('vxe.error.reqProp', ['table.tree-config.rowField']);
          }

          if (!treeOpts.parentField) {
            (0, _log.errLog)('vxe.error.reqProp', ['table.tree-config.parentField']);
          }

          if (!treeOpts.children) {
            (0, _log.errLog)('vxe.error.reqProp', ['tree-config.children']);
          }

          if (!treeOpts.mapChildren) {
            (0, _log.errLog)('vxe.error.reqProp', ['tree-config.mapChildren']);
          }

          if (treeOpts.children === treeOpts.mapChildren) {
            (0, _log.errLog)('vxe.error.errConflicts', ['tree-config.children', 'tree-config.mapChildren']);
          }

          fullData.forEach(function (row) {
            if (row[treeOpts.children] && row[treeOpts.children].length) {
              (0, _log.warnLog)('vxe.error.errConflicts', ['tree-config.transform', "row.".concat(treeOpts.children)]);
            }
          });
        }

        treeData = _xeUtils.default.toArrayTree(fullData, {
          key: treeOpts.rowField,
          parentKey: treeOpts.parentField,
          children: treeOpts.children,
          mapChildren: treeOpts.mapChildren
        });
        fullData = treeData.slice(0);
      } else {
        treeData = fullData.slice(0);
      }
    }

    scrollYStore.startIndex = 0;
    scrollYStore.endIndex = 1;
    scrollXStore.startIndex = 0;
    scrollXStore.endIndex = 1;
    editStore.insertList = [];
    editStore.removeList = [];
    var sYLoad = this.updateScrollYStatus(fullData);
    this.scrollYLoad = sYLoad; // 全量数据

    this.tableFullData = fullData;
    this.tableFullTreeData = treeData; // 缓存数据

    this.cacheRowMap(true); // 原始数据

    this.tableSynchData = datas; // 克隆原数据，用于显示编辑状态，与编辑值做对比

    if (keepSource) {
      this.tableSourceData = _xeUtils.default.clone(fullData, true);
    }

    if (process.env.NODE_ENV === 'development') {
      if (sYLoad) {
        if (!(this.height || this.maxHeight)) {
          (0, _log.errLog)('vxe.error.reqProp', ['table.height | table.max-height | table.scroll-y={enabled: false}']);
        }

        if (!this.showOverflow) {
          (0, _log.warnLog)('vxe.error.reqProp', ['table.show-overflow']);
        }

        if (this.spanMethod) {
          (0, _log.warnLog)('vxe.error.scrollErrProp', ['table.span-method']);
        }
      }
    }

    if (this.clearCellAreas && this.mouseConfig) {
      this.clearCellAreas();
      this.clearCopyCellArea();
    }

    this.clearMergeCells();
    this.clearMergeFooterItems();
    this.handleTableData(true);
    this.updateFooter();
    return this.$nextTick().then(function () {
      _this4.updateHeight();

      _this4.updateStyle();
    }).then(function () {
      _this4.computeScrollLoad();
    }).then(function () {
      // 是否启用了虚拟滚动
      if (sYLoad) {
        scrollYStore.endIndex = scrollYStore.visibleSize;
      }

      _this4.handleReserveStatus();

      _this4.checkSelectionStatus();

      return new Promise(function (resolve) {
        _this4.$nextTick().then(function () {
          return _this4.recalculate();
        }).then(function () {
          // 是否变更虚拟滚动
          if (oldScrollYLoad === sYLoad) {
            (0, _util.restoreScrollLocation)(_this4, lastScrollLeft, lastScrollTop).then(resolve);
          } else {
            setTimeout(function () {
              return (0, _util.restoreScrollLocation)(_this4, lastScrollLeft, lastScrollTop).then(resolve);
            });
          }
        });
      });
    });
  },

  /**
   * 重新加载数据，不会清空表格状态
   * @param {Array} datas 数据
   */
  loadData: function loadData(datas) {
    var _this5 = this;

    var inited = this.inited,
        initStatus = this.initStatus;
    return this.loadTableData(datas).then(function () {
      _this5.inited = true;
      _this5.initStatus = true;

      if (!initStatus) {
        _this5.handleLoadDefaults();
      }

      if (!inited) {
        _this5.handleInitDefaults();
      }

      return _this5.recalculate();
    });
  },

  /**
   * 重新加载数据，会清空表格状态
   * @param {Array} datas 数据
   */
  reloadData: function reloadData(datas) {
    var _this6 = this;

    var inited = this.inited;
    return this.clearAll().then(function () {
      _this6.inited = true;
      _this6.initStatus = true;
      return _this6.loadTableData(datas);
    }).then(function () {
      _this6.handleLoadDefaults();

      if (!inited) {
        _this6.handleInitDefaults();
      }

      return _this6.recalculate();
    });
  },

  /**
   * 局部加载行数据并恢复到初始状态
   * 对于行数据需要局部更改的场景中可能会用到
   * @param {Row} row 行对象
   * @param {Object} record 新数据
   * @param {String} field 字段名
   */
  reloadRow: function reloadRow(row, record, field) {
    var keepSource = this.keepSource,
        tableSourceData = this.tableSourceData,
        tableData = this.tableData;

    if (keepSource) {
      var rowIndex = this.getRowIndex(row);
      var oRow = tableSourceData[rowIndex];

      if (oRow && row) {
        if (field) {
          var newValue = _xeUtils.default.get(record || row, field);

          _xeUtils.default.set(row, field, newValue);

          _xeUtils.default.set(oRow, field, newValue);
        } else {
          var newRecord = _xeUtils.default.clone(_objectSpread({}, record), true);

          _xeUtils.default.destructuring(oRow, Object.assign(row, newRecord));
        }
      }

      this.tableData = tableData.slice(0);
    } else {
      if (process.env.NODE_ENV === 'development') {
        (0, _log.warnLog)('vxe.error.reqProp', ['keep-source']);
      }
    }

    return this.$nextTick();
  },

  /**
   * 加载列配置
   * 对于表格列需要重载、局部递增场景下可能会用到
   * @param {ColumnInfo} columns 列配置
   */
  loadColumn: function loadColumn(columns) {
    var _this7 = this;

    var collectColumn = _xeUtils.default.mapTree(columns, function (column) {
      return _cell.default.createColumn(_this7, column);
    }, {
      children: 'children'
    });

    return this.handleColumn(collectColumn);
  },

  /**
   * 加载列配置并恢复到初始状态
   * 对于表格列需要重载、局部递增场景下可能会用到
   * @param {ColumnInfo} columns 列配置
   */
  reloadColumn: function reloadColumn(columns) {
    var _this8 = this;

    return this.clearAll().then(function () {
      return _this8.loadColumn(columns);
    });
  },
  handleColumn: function handleColumn(collectColumn) {
    var _this9 = this;

    this.collectColumn = collectColumn;
    var tableFullColumn = getColumnList(collectColumn);
    this.tableFullColumn = tableFullColumn;
    this.cacheColumnMap();
    this.restoreCustomStorage();
    this.parseColumns().then(function () {
      if (_this9.scrollXLoad) {
        _this9.loadScrollXData(true);
      }
    });
    this.clearMergeCells();
    this.clearMergeFooterItems();
    this.handleTableData(true);

    if (process.env.NODE_ENV === 'development') {
      if ((this.scrollXLoad || this.scrollYLoad) && this.expandColumn) {
        (0, _log.warnLog)('vxe.error.scrollErrProp', ['column.type=expand']);
      }
    }

    return this.$nextTick().then(function () {
      if (_this9.$toolbar) {
        _this9.$toolbar.syncUpdate({
          collectColumn: collectColumn,
          $table: _this9
        });
      }

      return _this9.recalculate();
    });
  },

  /**
   * 更新数据行的 Map
   * 牺牲数据组装的耗时，用来换取使用过程中的流畅
   */
  cacheRowMap: function cacheRowMap(source) {
    var _this10 = this;

    var treeConfig = this.treeConfig,
        treeOpts = this.treeOpts,
        tableFullData = this.tableFullData,
        fullDataRowMap = this.fullDataRowMap,
        fullAllDataRowMap = this.fullAllDataRowMap,
        tableFullTreeData = this.tableFullTreeData;
    var fullDataRowIdData = this.fullDataRowIdData,
        fullAllDataRowIdData = this.fullAllDataRowIdData;
    var rowkey = (0, _util.getRowkey)(this);
    var isLazy = treeConfig && treeOpts.lazy;

    var handleCache = function handleCache(row, index, items, path, parent, nodes) {
      var rowid = (0, _util.getRowid)(_this10, row);
      var seq = treeConfig && path ? (0, _util.toTreePathSeq)(path) : index + 1;
      var level = nodes ? nodes.length - 1 : 0;

      if ((0, _utils.eqEmptyValue)(rowid)) {
        rowid = getRowUniqueId();

        _xeUtils.default.set(row, rowkey, rowid);
      }

      if (isLazy && row[treeOpts.hasChild] && _xeUtils.default.isUndefined(row[treeOpts.children])) {
        row[treeOpts.children] = null;
      }

      var rest = {
        row: row,
        rowid: rowid,
        seq: seq,
        index: treeConfig && parent ? -1 : index,
        _index: -1,
        $index: -1,
        items: items,
        parent: parent,
        level: level
      };

      if (source) {
        fullDataRowIdData[rowid] = rest;
        fullDataRowMap.set(row, rest);
      }

      fullAllDataRowIdData[rowid] = rest;
      fullAllDataRowMap.set(row, rest);
    };

    if (source) {
      fullDataRowIdData = this.fullDataRowIdData = {};
      fullDataRowMap.clear();
    }

    fullAllDataRowIdData = this.fullAllDataRowIdData = {};
    fullAllDataRowMap.clear();

    if (treeConfig) {
      _xeUtils.default.eachTree(tableFullTreeData, handleCache, treeOpts);
    } else {
      tableFullData.forEach(handleCache);
    }
  },
  loadTreeChildren: function loadTreeChildren(row, childRecords) {
    var _this11 = this;

    var keepSource = this.keepSource,
        tableSourceData = this.tableSourceData,
        treeOpts = this.treeOpts,
        fullDataRowIdData = this.fullDataRowIdData,
        fullDataRowMap = this.fullDataRowMap,
        fullAllDataRowMap = this.fullAllDataRowMap,
        fullAllDataRowIdData = this.fullAllDataRowIdData;
    var transform = treeOpts.transform,
        children = treeOpts.children,
        mapChildren = treeOpts.mapChildren;
    var rest = fullAllDataRowIdData[(0, _util.getRowid)(this, row)];
    var parentLevel = rest ? rest.level : 0;
    return this.createData(childRecords).then(function (rows) {
      if (keepSource) {
        var rowid = (0, _util.getRowid)(_this11, row);

        var matchObj = _xeUtils.default.findTree(tableSourceData, function (item) {
          return rowid === (0, _util.getRowid)(_this11, item);
        }, treeOpts);

        if (matchObj) {
          matchObj.item[children] = _xeUtils.default.clone(rows, true);
        }
      }

      _xeUtils.default.eachTree(rows, function (childRow, index, items, path, parent, nodes) {
        var rowid = (0, _util.getRowid)(_this11, childRow);
        var rest = {
          row: childRow,
          rowid: rowid,
          seq: -1,
          index: index,
          _index: -1,
          $index: -1,
          items: items,
          parent: parent,
          level: parentLevel + nodes.length
        };
        fullDataRowIdData[rowid] = rest;
        fullDataRowMap.set(childRow, rest);
        fullAllDataRowIdData[rowid] = rest;
        fullAllDataRowMap.set(childRow, rest);
      }, treeOpts);

      row[children] = rows;

      if (transform) {
        row[mapChildren] = rows;
      }

      _this11.updateAfterDataIndex();

      return rows;
    });
  },

  /**
   * 更新数据列的 Map
   * 牺牲数据组装的耗时，用来换取使用过程中的流畅
   */
  cacheColumnMap: function cacheColumnMap() {
    var _this12 = this;

    var tableFullColumn = this.tableFullColumn,
        collectColumn = this.collectColumn,
        fullColumnMap = this.fullColumnMap,
        showOverflow = this.showOverflow;
    var fullColumnIdData = this.fullColumnIdData = {};
    var fullColumnFieldData = this.fullColumnFieldData = {};
    var isGroup = collectColumn.some(hasChildrenList);
    var isAllOverflow = !!showOverflow;
    var expandColumn;
    var treeNodeColumn;
    var checkboxColumn;
    var radioColumn;
    var hasFixed;

    var handleFunc = function handleFunc(column, index, items, path, parent) {
      var colid = column.id,
          property = column.property,
          fixed = column.fixed,
          type = column.type,
          treeNode = column.treeNode;
      var rest = {
        column: column,
        colid: colid,
        index: index,
        items: items,
        parent: parent
      };

      if (property) {
        if (process.env.NODE_ENV === 'development') {
          if (fullColumnFieldData[property]) {
            (0, _log.warnLog)('vxe.error.colRepet', ['field', property]);
          }
        }

        fullColumnFieldData[property] = rest;
      }

      if (!hasFixed && fixed) {
        hasFixed = fixed;
      }

      if (treeNode) {
        if (process.env.NODE_ENV === 'development') {
          if (treeNodeColumn) {
            (0, _log.warnLog)('vxe.error.colRepet', ['tree-node', treeNode]);
          }
        }

        if (!treeNodeColumn) {
          treeNodeColumn = column;
        }
      } else if (type === 'expand') {
        if (process.env.NODE_ENV === 'development') {
          if (expandColumn) {
            (0, _log.warnLog)('vxe.error.colRepet', ['type', type]);
          }
        }

        if (!expandColumn) {
          expandColumn = column;
        }
      }

      if (process.env.NODE_ENV === 'development') {
        if (type === 'checkbox') {
          if (checkboxColumn) {
            (0, _log.warnLog)('vxe.error.colRepet', ['type', type]);
          }

          if (!checkboxColumn) {
            checkboxColumn = column;
          }
        } else if (type === 'radio') {
          if (radioColumn) {
            (0, _log.warnLog)('vxe.error.colRepet', ['type', type]);
          }

          if (!radioColumn) {
            radioColumn = column;
          }
        }
      }

      if (process.env.NODE_ENV === 'development') {
        if (_this12.showOverflow && column.showOverflow === false) {
          (0, _log.warnLog)('vxe.error.errConflicts', ["table.show-overflow=".concat(_this12.showOverflow), "column.show-overflow=".concat(column.showOverflow)]);
        }

        if (_this12.showHeaderOverflow && column.showHeaderOverflow === false) {
          (0, _log.warnLog)('vxe.error.errConflicts', ["table.show-header-overflow=".concat(_this12.showHeaderOverflow), "column.show-header-overflow=".concat(column.showHeaderOverflow)]);
        }

        if (_this12.showFooterOverflow && column.showFooterOverflow === false) {
          (0, _log.warnLog)('vxe.error.errConflicts', ["table.show-footer-overflow=".concat(_this12.showFooterOverflow), "column.show-footer-overflow=".concat(column.showFooterOverflow)]);
        }
      }

      if (isAllOverflow && column.showOverflow === false) {
        isAllOverflow = false;
      }

      if (fullColumnIdData[colid]) {
        (0, _log.errLog)('vxe.error.colRepet', ['colId', colid]);
      }

      fullColumnIdData[colid] = rest;
      fullColumnMap.set(column, rest);
    };

    fullColumnMap.clear();

    if (isGroup) {
      _xeUtils.default.eachTree(collectColumn, function (column, index, items, path, parent, nodes) {
        column.level = nodes.length;
        handleFunc(column, index, items, path, parent);
      });
    } else {
      tableFullColumn.forEach(handleFunc);
    }

    if (process.env.NODE_ENV === 'development') {
      if (expandColumn && this.mouseOpts.area) {
        (0, _log.errLog)('vxe.error.errConflicts', ['mouse-config.area', 'column.type=expand']);
      }
    }

    this.isGroup = isGroup;
    this.treeNodeColumn = treeNodeColumn;
    this.expandColumn = expandColumn;
    this.isAllOverflow = isAllOverflow;
  },

  /**
   * 根据 tr 元素获取对应的 row 信息
   * @param {Element} tr 元素
   */
  getRowNode: function getRowNode(tr) {
    if (tr) {
      var fullAllDataRowIdData = this.fullAllDataRowIdData;
      var rowid = tr.getAttribute('rowid');
      var rest = fullAllDataRowIdData[rowid];

      if (rest) {
        return {
          rowid: rest.rowid,
          item: rest.row,
          index: rest.index,
          items: rest.items,
          parent: rest.parent
        };
      }
    }

    return null;
  },

  /**
   * 根据 th/td 元素获取对应的 column 信息
   * @param {Element} cell 元素
   */
  getColumnNode: function getColumnNode(cell) {
    if (cell) {
      var fullColumnIdData = this.fullColumnIdData;
      var colid = cell.getAttribute('colid');
      var rest = fullColumnIdData[colid];

      if (rest) {
        return {
          colid: rest.colid,
          item: rest.column,
          index: rest.index,
          items: rest.items,
          parent: rest.parent
        };
      }
    }

    return null;
  },

  /**
   * 根据 row 获取序号
   * @param {Row} row 行对象
   */
  getRowSeq: function getRowSeq(row) {
    var fullDataRowIdData = this.fullDataRowIdData;

    if (row) {
      var rowid = (0, _util.getRowid)(this, row);
      var rest = fullDataRowIdData[rowid];

      if (rest) {
        return rest.seq;
      }
    }

    return -1;
  },

  /**
   * 根据 row 获取相对于 data 中的索引
   * @param {Row} row 行对象
   */
  getRowIndex: function getRowIndex(row) {
    return this.fullDataRowMap.has(row) ? this.fullDataRowMap.get(row).index : -1;
  },

  /**
   * 根据 row 获取相对于当前数据中的索引
   * @param {Row} row 行对象
   */
  getVTRowIndex: function getVTRowIndex(row) {
    return this.afterFullData.indexOf(row);
  },
  // 在 v3 中废弃
  _getRowIndex: function _getRowIndex(row) {
    if (process.env.NODE_ENV === 'development') {
      (0, _log.warnLog)('vxe.error.delFunc', ['_getRowIndex', 'getVTRowIndex']);
    }

    return this.getVTRowIndex(row);
  },

  /**
   * 根据 row 获取渲染中的虚拟索引
   * @param {Row} row 行对象
   */
  getVMRowIndex: function getVMRowIndex(row) {
    return this.tableData.indexOf(row);
  },
  // 在 v3 中废弃
  $getRowIndex: function $getRowIndex(row) {
    if (process.env.NODE_ENV === 'development') {
      (0, _log.warnLog)('vxe.error.delFunc', ['$getRowIndex', 'getVMRowIndex']);
    }

    return this.getVMRowIndex(row);
  },

  /**
   * 根据 column 获取相对于 columns 中的索引
   * @param {ColumnInfo} column 列配置
   */
  getColumnIndex: function getColumnIndex(column) {
    return this.fullColumnMap.has(column) ? this.fullColumnMap.get(column).index : -1;
  },

  /**
   * 根据 column 获取相对于当前表格列中的索引
   * @param {ColumnInfo} column 列配置
   */
  getVTColumnIndex: function getVTColumnIndex(column) {
    return this.visibleColumn.indexOf(column);
  },
  // 在 v3 中废弃
  _getColumnIndex: function _getColumnIndex(column) {
    if (process.env.NODE_ENV === 'development') {
      (0, _log.warnLog)('vxe.error.delFunc', ['_getColumnIndex', 'getVTColumnIndex']);
    }

    return this.getVTColumnIndex(column);
  },

  /**
   * 根据 column 获取渲染中的虚拟索引
   * @param {ColumnInfo} column 列配置
   */
  getVMColumnIndex: function getVMColumnIndex(column) {
    return this.tableColumn.indexOf(column);
  },
  // 在 v3 中废弃
  $getColumnIndex: function $getColumnIndex(column) {
    if (process.env.NODE_ENV === 'development') {
      (0, _log.warnLog)('vxe.error.delFunc', ['$getColumnIndex', 'getVMColumnIndex']);
    }

    return this.getVMColumnIndex(column);
  },

  /**
   * 判断是否为索引列
   * @param {ColumnInfo} column 列配置
   */
  isSeqColumn: function isSeqColumn(column) {
    return column && column.type === 'seq';
  },

  /**
   * 定义行数据中的列属性，如果不存在则定义
   * @param {Row} record 行数据
   */
  defineField: function defineField(record) {
    var radioOpts = this.radioOpts,
        checkboxOpts = this.checkboxOpts,
        treeConfig = this.treeConfig,
        treeOpts = this.treeOpts,
        expandOpts = this.expandOpts;
    var rowkey = (0, _util.getRowkey)(this);
    this.tableFullColumn.forEach(function (column) {
      var property = column.property,
          editRender = column.editRender;

      if (property && !_xeUtils.default.has(record, property)) {
        var cellValue = null;

        if (editRender) {
          var defaultValue = editRender.defaultValue;

          if (_xeUtils.default.isFunction(defaultValue)) {
            cellValue = defaultValue({
              column: column
            });
          } else if (!_xeUtils.default.isUndefined(defaultValue)) {
            cellValue = defaultValue;
          }
        }

        _xeUtils.default.set(record, property, cellValue);
      }
    });
    var otherFields = [radioOpts.labelField, checkboxOpts.checkField, checkboxOpts.labelField, expandOpts.labelField];
    otherFields.forEach(function (key) {
      if (key && (0, _utils.eqEmptyValue)(_xeUtils.default.get(record, key))) {
        _xeUtils.default.set(record, key, null);
      }
    });

    if (treeConfig && treeOpts.lazy && _xeUtils.default.isUndefined(record[treeOpts.children])) {
      record[treeOpts.children] = null;
    } // 必须有行数据的唯一主键，可以自行设置；也可以默认生成一个随机数


    if ((0, _utils.eqEmptyValue)(_xeUtils.default.get(record, rowkey))) {
      _xeUtils.default.set(record, rowkey, getRowUniqueId());
    }

    return record;
  },

  /**
   * 创建 data 对象
   * 对于某些特殊场景可能会用到，会自动对数据的字段名进行检测，如果不存在就自动定义
   * @param {Array} records 新数据
   */
  createData: function createData(records) {
    var _this13 = this;

    var treeConfig = this.treeConfig,
        treeOpts = this.treeOpts;

    var handleRrecord = function handleRrecord(record) {
      return _this13.defineField(Object.assign({}, record));
    };

    var rows = treeConfig ? _xeUtils.default.mapTree(records, handleRrecord, treeOpts) : records.map(handleRrecord);
    return this.$nextTick().then(function () {
      return rows;
    });
  },

  /**
   * 创建 Row|Rows 对象
   * 对于某些特殊场景需要对数据进行手动插入时可能会用到
   * @param {Array/Object} records 新数据
   */
  createRow: function createRow(records) {
    var _this14 = this;

    var isArr = _xeUtils.default.isArray(records);

    if (!isArr) {
      records = [records];
    }

    return this.$nextTick().then(function () {
      return _this14.createData(records).then(function (rows) {
        return isArr ? rows : rows[0];
      });
    });
  },

  /**
   * 还原数据
   * 如果不传任何参数，则还原整个表格
   * 如果传 row 则还原一行
   * 如果传 rows 则还原多行
   * 如果还额外传了 field 则还原指定的单元格数据
   */
  revertData: function revertData(rows, field) {
    var _this15 = this;

    var keepSource = this.keepSource,
        tableSourceData = this.tableSourceData,
        treeConfig = this.treeConfig;

    if (!keepSource) {
      if (process.env.NODE_ENV === 'development') {
        (0, _log.warnLog)('vxe.error.reqProp', ['keep-source']);
      }

      return this.$nextTick();
    }

    var targetRows = rows;

    if (rows) {
      if (!_xeUtils.default.isArray(rows)) {
        targetRows = [rows];
      }
    } else {
      targetRows = _xeUtils.default.toArray(this.getUpdateRecords());
    }

    if (targetRows.length) {
      targetRows.forEach(function (row) {
        if (!_this15.isInsertByRow(row)) {
          var rowIndex = _this15.getRowIndex(row);

          if (treeConfig && rowIndex === -1) {
            throw new Error(_utils.default.getLog('vxe.error.noTree', ['revertData']));
          }

          var oRow = tableSourceData[rowIndex];

          if (oRow && row) {
            if (field) {
              _xeUtils.default.set(row, field, _xeUtils.default.clone(_xeUtils.default.get(oRow, field), true));
            } else {
              _xeUtils.default.destructuring(row, _xeUtils.default.clone(oRow, true));
            }
          }
        }
      });
    }

    if (rows) {
      return this.$nextTick();
    }

    return this.reloadData(tableSourceData);
  },

  /**
   * 清空单元格内容
   * 如果不创参数，则清空整个表格内容
   * 如果传 row 则清空一行内容
   * 如果传 rows 则清空多行内容
   * 如果还额外传了 field 则清空指定单元格内容
   * @param {Array/Row} rows 行数据
   * @param {String} field 字段名
   */
  clearData: function clearData(rows, field) {
    var tableFullData = this.tableFullData,
        visibleColumn = this.visibleColumn;

    if (!arguments.length) {
      rows = tableFullData;
    } else if (rows && !_xeUtils.default.isArray(rows)) {
      rows = [rows];
    }

    if (field) {
      rows.forEach(function (row) {
        return _xeUtils.default.set(row, field, null);
      });
    } else {
      rows.forEach(function (row) {
        visibleColumn.forEach(function (column) {
          if (column.property) {
            setCellValue(row, column, null);
          }
        });
      });
    }

    return this.$nextTick();
  },

  /**
   * 检查是否为临时行数据
   * @param {Row} row 行对象
   */
  isInsertByRow: function isInsertByRow(row) {
    return this.editStore.insertList.indexOf(row) > -1;
  },

  /**
   * 删除所有新增的临时数据
   * @returns
   */
  removeInsertRow: function removeInsertRow() {
    return this.remove(this.editStore.insertList);
  },

  /**
   * 检查行或列数据是否发生改变
   * @param {Row} row 行对象
   * @param {String} field 字段名
   */
  isUpdateByRow: function isUpdateByRow(row, field) {
    var _this16 = this;

    var visibleColumn = this.visibleColumn,
        keepSource = this.keepSource,
        treeConfig = this.treeConfig,
        treeOpts = this.treeOpts,
        tableSourceData = this.tableSourceData,
        fullDataRowIdData = this.fullDataRowIdData;

    if (keepSource) {
      var oRow, property;
      var rowid = (0, _util.getRowid)(this, row); // 新增的数据不需要检测

      if (!fullDataRowIdData[rowid]) {
        return false;
      }

      if (treeConfig) {
        var children = treeOpts.children;

        var matchObj = _xeUtils.default.findTree(tableSourceData, function (item) {
          return rowid === (0, _util.getRowid)(_this16, item);
        }, treeOpts);

        row = Object.assign({}, row, _defineProperty({}, children, null));

        if (matchObj) {
          oRow = Object.assign({}, matchObj.item, _defineProperty({}, children, null));
        }
      } else {
        var oRowIndex = fullDataRowIdData[rowid].index;
        oRow = tableSourceData[oRowIndex];
      }

      if (oRow) {
        if (arguments.length > 1) {
          return !eqCellValue(oRow, row, field);
        }

        for (var index = 0, len = visibleColumn.length; index < len; index++) {
          property = visibleColumn[index].property;

          if (property && !eqCellValue(oRow, row, property)) {
            return true;
          }
        }
      }
    }

    return false;
  },

  /**
   * 获取表格的可视列，也可以指定索引获取列
   * @param {Number} columnIndex 索引
   */
  getColumns: function getColumns(columnIndex) {
    var columns = this.visibleColumn;
    return _xeUtils.default.isUndefined(columnIndex) ? columns.slice(0) : columns[columnIndex];
  },

  /**
   * 根据列的唯一主键获取列
   * @param {String} colid 列主键
   */
  getColumnById: function getColumnById(colid) {
    var fullColumnIdData = this.fullColumnIdData;
    return fullColumnIdData[colid] ? fullColumnIdData[colid].column : null;
  },

  /**
   * 根据列的字段名获取列
   * @param {String} field 字段名
   */
  getColumnByField: function getColumnByField(field) {
    var fullColumnFieldData = this.fullColumnFieldData;
    return fullColumnFieldData[field] ? fullColumnFieldData[field].column : null;
  },

  /**
   * 获取当前表格的列
   * 收集到的全量列、全量表头列、处理条件之后的全量表头列、当前渲染中的表头列
   */
  getTableColumn: function getTableColumn() {
    return {
      collectColumn: this.collectColumn.slice(0),
      fullColumn: this.tableFullColumn.slice(0),
      visibleColumn: this.visibleColumn.slice(0),
      tableColumn: this.tableColumn.slice(0)
    };
  },

  /**
   * 获取数据，和 data 的行为一致，也可以指定索引获取数据
   */
  getData: function getData(rowIndex) {
    var tableSynchData = this.data || this.tableSynchData;
    return _xeUtils.default.isUndefined(rowIndex) ? tableSynchData.slice(0) : tableSynchData[rowIndex];
  },

  /**
   * 用于多选行，获取已选中的数据
   */
  getCheckboxRecords: function getCheckboxRecords(isFull) {
    var tableFullData = this.tableFullData,
        afterFullData = this.afterFullData,
        treeConfig = this.treeConfig,
        treeOpts = this.treeOpts,
        checkboxOpts = this.checkboxOpts,
        tableFullTreeData = this.tableFullTreeData,
        afterTreeFullData = this.afterTreeFullData;
    var transform = treeOpts.transform,
        children = treeOpts.children,
        mapChildren = treeOpts.mapChildren;
    var property = checkboxOpts.checkField;
    var currTableData = isFull ? transform ? tableFullTreeData : tableFullData : transform ? afterTreeFullData : afterFullData;
    var rowList = [];

    if (property) {
      if (treeConfig) {
        rowList = _xeUtils.default.filterTree(currTableData, function (row) {
          return _xeUtils.default.get(row, property);
        }, {
          children: transform ? mapChildren : children
        });
      } else {
        rowList = currTableData.filter(function (row) {
          return _xeUtils.default.get(row, property);
        });
      }
    } else {
      var selection = this.selection;

      if (treeConfig) {
        rowList = _xeUtils.default.filterTree(currTableData, function (row) {
          return selection.indexOf(row) > -1;
        }, {
          children: transform ? mapChildren : children
        });
      } else {
        rowList = currTableData.filter(function (row) {
          return selection.indexOf(row) > -1;
        });
      }
    }

    return rowList;
  },

  /**
   * 如果为虚拟树，将树结构拍平
   * @returns
   */
  handleVirtualTreeToList: function handleVirtualTreeToList() {
    var treeOpts = this.treeOpts,
        treeConfig = this.treeConfig,
        treeExpandeds = this.treeExpandeds,
        afterTreeFullData = this.afterTreeFullData,
        afterFullData = this.afterFullData;

    if (treeConfig && treeOpts.transform) {
      var fullData = [];
      var expandMaps = new Map();

      _xeUtils.default.eachTree(afterTreeFullData, function (row, index, items, path, parent) {
        if (!parent || expandMaps.has(parent) && treeExpandeds.indexOf(parent) > -1) {
          expandMaps.set(row, 1);
          fullData.push(row);
        }
      }, {
        children: treeOpts.mapChildren
      });

      this.afterFullData = fullData;
      this.updateScrollYStatus(fullData);
      return fullData;
    }

    return afterFullData;
  },

  /**
   * 获取处理后全量的表格数据
   * 如果存在筛选条件，继续处理
   */
  updateAfterFullData: function updateAfterFullData() {
    var _this17 = this;

    var tableFullColumn = this.tableFullColumn,
        tableFullData = this.tableFullData,
        filterOpts = this.filterOpts,
        sortOpts = this.sortOpts,
        treeConfig = this.treeConfig,
        treeOpts = this.treeOpts,
        tableFullTreeData = this.tableFullTreeData;
    var allRemoteFilter = filterOpts.remote,
        allFilterMethod = filterOpts.filterMethod;
    var allRemoteSort = sortOpts.remote,
        allSortMethod = sortOpts.sortMethod,
        sortMultiple = sortOpts.multiple,
        chronological = sortOpts.chronological;
    var transform = treeOpts.transform;
    var tableData = [];
    var tableTree = [];
    var filterColumns = [];
    var orderColumns = [];
    tableFullColumn.forEach(function (column) {
      var property = column.property,
          sortable = column.sortable,
          order = column.order,
          filters = column.filters;

      if (!allRemoteFilter && filters && filters.length) {
        var valueList = [];
        var itemList = [];
        filters.forEach(function (item) {
          if (item.checked) {
            itemList.push(item);
            valueList.push(item.value);
          }
        });

        if (itemList.length) {
          filterColumns.push({
            column: column,
            valueList: valueList,
            itemList: itemList
          });
        }
      }

      if (!allRemoteSort && sortable && order) {
        orderColumns.push({
          column: column,
          field: column.property,
          property: property,
          order: order,
          sortTime: column.sortTime
        });
      }
    });

    if (sortMultiple && chronological && orderColumns.length > 1) {
      orderColumns = _xeUtils.default.orderBy(orderColumns, 'sortTime');
    }

    if (filterColumns.length) {
      var handleFilter = function handleFilter(row) {
        return filterColumns.every(function (_ref) {
          var column = _ref.column,
              valueList = _ref.valueList,
              itemList = _ref.itemList;

          if (valueList.length && !allRemoteFilter) {
            var filterMethod = column.filterMethod,
                filterRender = column.filterRender;
            var compConf = filterRender ? _vXETable.default.renderer.get(filterRender.name) : null;
            var compFilterMethod = compConf && compConf.renderFilter ? compConf.filterMethod : null;
            var defaultFilterMethod = compConf ? compConf.defaultFilterMethod : null;

            var cellValue = _utils.default.getCellValue(row, column);

            if (filterMethod) {
              return itemList.some(function (item) {
                return filterMethod({
                  value: item.value,
                  option: item,
                  cellValue: cellValue,
                  row: row,
                  column: column,
                  $table: _this17
                });
              });
            } else if (compFilterMethod) {
              return itemList.some(function (item) {
                return compFilterMethod({
                  value: item.value,
                  option: item,
                  cellValue: cellValue,
                  row: row,
                  column: column,
                  $table: _this17
                });
              });
            } else if (allFilterMethod) {
              return allFilterMethod({
                options: itemList,
                values: valueList,
                cellValue: cellValue,
                row: row,
                column: column
              });
            } else if (defaultFilterMethod) {
              return itemList.some(function (item) {
                return defaultFilterMethod({
                  value: item.value,
                  option: item,
                  cellValue: cellValue,
                  row: row,
                  column: column,
                  $table: _this17
                });
              });
            }

            return valueList.indexOf(_xeUtils.default.get(row, column.property)) > -1;
          }

          return true;
        });
      };

      if (treeConfig && transform) {
        // 筛选虚拟树
        tableTree = _xeUtils.default.searchTree(tableFullTreeData, handleFilter, _objectSpread(_objectSpread({}, treeOpts), {}, {
          original: true
        }));
        tableData = tableTree;
      } else {
        tableData = treeConfig ? tableFullTreeData.filter(handleFilter) : tableFullData.filter(handleFilter);
        tableTree = tableData;
      }
    } else {
      if (treeConfig && transform) {
        // 还原虚拟树
        tableTree = _xeUtils.default.searchTree(tableFullTreeData, function () {
          return true;
        }, _objectSpread(_objectSpread({}, treeOpts), {}, {
          original: true
        }));
        tableData = tableTree;
      } else {
        tableData = treeConfig ? tableFullTreeData.slice(0) : tableFullData.slice(0);
        tableTree = tableData;
      }
    }

    var firstOrderColumn = orderColumns[0];

    if (!allRemoteSort && firstOrderColumn) {
      if (treeConfig && transform) {
        // 虚拟树和列表一样，只能排序根级节点
        if (allSortMethod) {
          var sortRests = allSortMethod({
            data: tableTree,
            sortList: orderColumns,
            $table: this
          });
          tableTree = _xeUtils.default.isArray(sortRests) ? sortRests : tableTree;
        } else {
          tableTree = _xeUtils.default.orderBy(tableTree, orderColumns.map(function (_ref2) {
            var column = _ref2.column,
                order = _ref2.order;
            return [getOrderField(_this17, column), order];
          }));
        }

        tableData = tableTree;
      } else {
        if (allSortMethod) {
          var _sortRests = allSortMethod({
            data: tableData,
            column: firstOrderColumn.column,
            property: firstOrderColumn.property,
            order: firstOrderColumn.order,
            sortList: orderColumns,
            $table: this
          });

          tableData = _xeUtils.default.isArray(_sortRests) ? _sortRests : tableData;
        } else {
          // 兼容 v4
          if (sortMultiple) {
            tableData = _xeUtils.default.orderBy(tableData, orderColumns.map(function (_ref3) {
              var column = _ref3.column,
                  order = _ref3.order;
              return [getOrderField(_this17, column), order];
            }));
          } else {
            // 兼容 v2，在 v4 中废弃， sortBy 不能为数组
            var sortByConfs;

            if (_xeUtils.default.isArray(firstOrderColumn.sortBy)) {
              sortByConfs = firstOrderColumn.sortBy.map(function (item) {
                return [item, firstOrderColumn.order];
              });
            }

            tableData = _xeUtils.default.orderBy(tableData, sortByConfs || [firstOrderColumn].map(function (_ref4) {
              var column = _ref4.column,
                  order = _ref4.order;
              return [getOrderField(_this17, column), order];
            }));
          }
        }

        tableTree = tableData;
      }
    }

    this.afterFullData = tableData;
    this.afterTreeFullData = tableTree;
    this.updateAfterDataIndex();
  },

  /**
   * 预编译
   * 对渲染中的数据提前解析序号及索引。牺牲提前编译耗时换取渲染中额外损耗，使运行时更加流畅
   */
  updateAfterDataIndex: function updateAfterDataIndex() {
    var _this18 = this;

    var treeConfig = this.treeConfig,
        afterFullData = this.afterFullData,
        fullDataRowIdData = this.fullDataRowIdData,
        fullAllDataRowIdData = this.fullAllDataRowIdData,
        afterTreeFullData = this.afterTreeFullData,
        treeOpts = this.treeOpts;

    if (treeConfig) {
      _xeUtils.default.eachTree(afterTreeFullData, function (row, index, items, path) {
        var rowid = (0, _util.getRowid)(_this18, row);
        var allrest = fullAllDataRowIdData[rowid];
        var seq = path.map(function (num, i) {
          return i % 2 === 0 ? Number(num) + 1 : '.';
        }).join('');

        if (allrest) {
          allrest.seq = seq;
          allrest._index = index;
        } else {
          var rest = {
            row: row,
            rowid: rowid,
            seq: seq,
            index: -1,
            $index: -1,
            _index: index,
            items: [],
            parent: null,
            level: 0
          };
          fullAllDataRowIdData[rowid] = rest;
          fullDataRowIdData[rowid] = rest;
        }
      }, {
        children: treeOpts.transform ? treeOpts.mapChildren : treeOpts.children
      });
    } else {
      afterFullData.forEach(function (row, index) {
        var rowid = (0, _util.getRowid)(_this18, row);
        var allrest = fullAllDataRowIdData[rowid];
        var seq = index + 1;

        if (allrest) {
          allrest.seq = seq;
          allrest._index = index;
        } else {
          var rest = {
            row: row,
            rowid: rowid,
            seq: seq,
            index: -1,
            $index: -1,
            _index: index,
            items: [],
            parent: null,
            level: 0
          };
          fullAllDataRowIdData[rowid] = rest;
          fullDataRowIdData[rowid] = rest;
        }
      });
    }
  },

  /**
   * 只对 tree-config 有效，获取行的父级
   */
  getParentRow: function getParentRow(rowOrRowid) {
    var treeConfig = this.treeConfig,
        fullDataRowIdData = this.fullDataRowIdData;

    if (rowOrRowid && treeConfig) {
      var rowid;

      if (_xeUtils.default.isString(rowOrRowid)) {
        rowid = rowOrRowid;
      } else {
        rowid = (0, _util.getRowid)(this, rowOrRowid);
      }

      if (rowid) {
        return fullDataRowIdData[rowid] ? fullDataRowIdData[rowid].parent : null;
      }
    }

    return null;
  },

  /**
   * 根据行的唯一主键获取行
   * @param {String/Number} rowid 行主键
   */
  getRowById: function getRowById(rowid) {
    var fullDataRowIdData = this.fullDataRowIdData;
    return fullDataRowIdData[rowid] ? fullDataRowIdData[rowid].row : null;
  },

  /**
   * 根据行获取行的唯一主键
   * @param {Row} row 行对象
   */
  getRowid: function getRowid(row) {
    var fullAllDataRowMap = this.fullAllDataRowMap;
    return fullAllDataRowMap.has(row) ? fullAllDataRowMap.get(row).rowid : null;
  },

  /**
   * 获取处理后的表格数据
   * 如果存在筛选条件，继续处理
   * 如果存在排序，继续处理
   */
  getTableData: function getTableData() {
    var tableFullData = this.tableFullData,
        afterFullData = this.afterFullData,
        tableData = this.tableData,
        footerTableData = this.footerTableData;
    return {
      fullData: tableFullData.slice(0),
      visibleData: afterFullData.slice(0),
      tableData: tableData.slice(0),
      footerData: footerTableData.slice(0)
    };
  },

  /**
   * 处理数据加载默认行为
   * 默认执行一次，除非被重置
   */
  handleLoadDefaults: function handleLoadDefaults() {
    var _this19 = this;

    if (this.checkboxConfig) {
      this.handleDefaultSelectionChecked();
    }

    if (this.radioConfig) {
      this.handleDefaultRadioChecked();
    }

    if (this.expandConfig) {
      this.handleDefaultRowExpand();
    }

    if (this.treeConfig) {
      this.handleDefaultTreeExpand();
    }

    if (this.mergeCells) {
      this.handleDefaultMergeCells();
    }

    if (this.mergeFooterItems) {
      this.handleDefaultMergeFooterItems();
    }

    this.$nextTick(function () {
      return setTimeout(_this19.recalculate);
    });
  },

  /**
   * 处理初始化的默认行为
   * 只会执行一次
   */
  handleInitDefaults: function handleInitDefaults() {
    var sortConfig = this.sortConfig;

    if (sortConfig) {
      this.handleDefaultSort();
    }
  },

  /**
   * 隐藏指定列
   */
  hideColumn: function hideColumn(fieldOrColumn) {
    var column = (0, _util.handleFieldOrColumn)(this, fieldOrColumn);

    if (column) {
      column.visible = false;
    }

    return this.handleCustom();
  },

  /**
   * 显示指定列
   */
  showColumn: function showColumn(fieldOrColumn) {
    var column = (0, _util.handleFieldOrColumn)(this, fieldOrColumn);

    if (column) {
      column.visible = true;
    }

    return this.handleCustom();
  },

  /**
   * 手动重置列的显示隐藏、列宽拖动的状态；
   * 如果为 true 则重置所有状态
   * 如果已关联工具栏，则会同步更新
   */
  resetColumn: function resetColumn(options) {
    var customOpts = this.customOpts;
    var checkMethod = customOpts.checkMethod;
    var opts = Object.assign({
      visible: true,
      resizable: options === true
    }, options);
    this.tableFullColumn.forEach(function (column) {
      if (opts.resizable) {
        column.resizeWidth = 0;
      }

      if (!checkMethod || checkMethod({
        column: column
      })) {
        column.visible = column.defaultVisible;
      }
    });

    if (opts.resizable) {
      this.saveCustomResizable(true);
    }

    return this.handleCustom();
  },
  handleCustom: function handleCustom() {
    this.saveCustomVisible();
    this.analyColumnWidth();
    return this.refreshColumn();
  },

  /**
   * 还原自定义列操作状态
   */
  restoreCustomStorage: function restoreCustomStorage() {
    var id = this.id,
        collectColumn = this.collectColumn,
        customConfig = this.customConfig,
        customOpts = this.customOpts;
    var storage = customOpts.storage;
    var isAllStorage = customOpts.storage === true;
    var isResizable = isAllStorage || storage && storage.resizable;
    var isVisible = isAllStorage || storage && storage.visible;

    if (customConfig && (isResizable || isVisible)) {
      var customMap = {};

      if (!id) {
        (0, _log.errLog)('vxe.error.reqProp', ['id']);
        return;
      }

      if (isResizable) {
        var columnWidthStorage = getCustomStorageMap(resizableStorageKey)[id];

        if (columnWidthStorage) {
          _xeUtils.default.each(columnWidthStorage, function (resizeWidth, field) {
            customMap[field] = {
              field: field,
              resizeWidth: resizeWidth
            };
          });
        }
      }

      if (isVisible) {
        var columnVisibleStorage = getCustomStorageMap(visibleStorageKey)[id];

        if (columnVisibleStorage) {
          var colVisibles = columnVisibleStorage.split('|');
          var colHides = colVisibles[0] ? colVisibles[0].split(',') : [];
          var colShows = colVisibles[1] ? colVisibles[1].split(',') : [];
          colHides.forEach(function (field) {
            if (customMap[field]) {
              customMap[field].visible = false;
            } else {
              customMap[field] = {
                field: field,
                visible: false
              };
            }
          });
          colShows.forEach(function (field) {
            if (customMap[field]) {
              customMap[field].visible = true;
            } else {
              customMap[field] = {
                field: field,
                visible: true
              };
            }
          });
        }
      }

      var keyMap = {};

      _xeUtils.default.eachTree(collectColumn, function (column) {
        var colKey = column.getKey();

        if (colKey) {
          keyMap[colKey] = column;
        }
      });

      _xeUtils.default.each(customMap, function (_ref5, field) {
        var visible = _ref5.visible,
            resizeWidth = _ref5.resizeWidth;
        var column = keyMap[field];

        if (column) {
          if (_xeUtils.default.isNumber(resizeWidth)) {
            column.resizeWidth = resizeWidth;
          }

          if (_xeUtils.default.isBoolean(visible)) {
            column.visible = visible;
          }
        }
      });
    }
  },
  saveCustomVisible: function saveCustomVisible() {
    var id = this.id,
        collectColumn = this.collectColumn,
        customConfig = this.customConfig,
        customOpts = this.customOpts;
    var checkMethod = customOpts.checkMethod,
        storage = customOpts.storage;
    var isAllStorage = customOpts.storage === true;
    var isVisible = isAllStorage || storage && storage.visible;

    if (customConfig && isVisible) {
      var columnVisibleStorageMap = getCustomStorageMap(visibleStorageKey);
      var colHides = [];
      var colShows = [];

      if (!id) {
        (0, _log.errLog)('vxe.error.reqProp', ['id']);
        return;
      }

      _xeUtils.default.eachTree(collectColumn, function (column) {
        if (!checkMethod || checkMethod({
          column: column
        })) {
          if (!column.visible && column.defaultVisible) {
            var colKey = column.getKey();

            if (colKey) {
              colHides.push(colKey);
            }
          } else if (column.visible && !column.defaultVisible) {
            var _colKey = column.getKey();

            if (_colKey) {
              colShows.push(_colKey);
            }
          }
        }
      });

      columnVisibleStorageMap[id] = [colHides.join(',')].concat(colShows.length ? [colShows.join(',')] : []).join('|') || undefined;
      localStorage.setItem(visibleStorageKey, _xeUtils.default.toJSONString(columnVisibleStorageMap));
    }
  },
  saveCustomResizable: function saveCustomResizable(isReset) {
    var id = this.id,
        collectColumn = this.collectColumn,
        customConfig = this.customConfig,
        customOpts = this.customOpts;
    var storage = customOpts.storage;
    var isAllStorage = customOpts.storage === true;
    var isResizable = isAllStorage || storage && storage.resizable;

    if (customConfig && isResizable) {
      var columnWidthStorageMap = getCustomStorageMap(resizableStorageKey);
      var columnWidthStorage;

      if (!id) {
        (0, _log.errLog)('vxe.error.reqProp', ['id']);
        return;
      }

      if (!isReset) {
        columnWidthStorage = _xeUtils.default.isPlainObject(columnWidthStorageMap[id]) ? columnWidthStorageMap[id] : {};

        _xeUtils.default.eachTree(collectColumn, function (column) {
          if (column.resizeWidth) {
            var colKey = column.getKey();

            if (colKey) {
              columnWidthStorage[colKey] = column.renderWidth;
            }
          }
        });
      }

      columnWidthStorageMap[id] = _xeUtils.default.isEmpty(columnWidthStorage) ? undefined : columnWidthStorage;
      localStorage.setItem(resizableStorageKey, _xeUtils.default.toJSONString(columnWidthStorageMap));
    }
  },

  /**
   * 刷新列配置
   */
  refreshColumn: function refreshColumn() {
    var _this20 = this;

    return this.parseColumns().then(function () {
      return _this20.refreshScroll();
    }).then(function () {
      return _this20.recalculate();
    });
  },

  /**
   * 刷新列信息
   * 将固定的列左边、右边分别靠边
   */
  parseColumns: function parseColumns() {
    var _this21 = this;

    var leftList = [];
    var centerList = [];
    var rightList = [];
    var collectColumn = this.collectColumn,
        tableFullColumn = this.tableFullColumn,
        isGroup = this.isGroup,
        columnStore = this.columnStore,
        sXOpts = this.sXOpts,
        scrollXStore = this.scrollXStore; // 如果是分组表头，如果子列全部被隐藏，则根列也隐藏

    if (isGroup) {
      var leftGroupList = [];
      var centerGroupList = [];
      var rightGroupList = [];

      _xeUtils.default.eachTree(collectColumn, function (column, index, items, path, parent) {
        var isColGroup = hasChildrenList(column); // 如果是分组，必须按组设置固定列，不允许给子列设置固定

        if (parent && parent.fixed) {
          column.fixed = parent.fixed;
        }

        if (parent && column.fixed !== parent.fixed) {
          (0, _log.errLog)('vxe.error.groupFixed');
        }

        if (isColGroup) {
          column.visible = !!_xeUtils.default.findTree(column.children, function (subColumn) {
            return hasChildrenList(subColumn) ? null : subColumn.visible;
          });
        } else if (column.visible) {
          if (column.fixed === 'left') {
            leftList.push(column);
          } else if (column.fixed === 'right') {
            rightList.push(column);
          } else {
            centerList.push(column);
          }
        }
      });

      collectColumn.forEach(function (column) {
        if (column.visible) {
          if (column.fixed === 'left') {
            leftGroupList.push(column);
          } else if (column.fixed === 'right') {
            rightGroupList.push(column);
          } else {
            centerGroupList.push(column);
          }
        }
      });
      this.tableGroupColumn = leftGroupList.concat(centerGroupList).concat(rightGroupList);
    } else {
      // 重新分配列
      tableFullColumn.forEach(function (column) {
        if (column.visible) {
          if (column.fixed === 'left') {
            leftList.push(column);
          } else if (column.fixed === 'right') {
            rightList.push(column);
          } else {
            centerList.push(column);
          }
        }
      });
    }

    var visibleColumn = leftList.concat(centerList).concat(rightList);
    var scrollXLoad = sXOpts.enabled && sXOpts.gt > -1 && sXOpts.gt < tableFullColumn.length;
    this.hasFixedColumn = leftList.length > 0 || rightList.length > 0;
    Object.assign(columnStore, {
      leftList: leftList,
      centerList: centerList,
      rightList: rightList
    });

    if (scrollXLoad && isGroup) {
      scrollXLoad = false;

      if (process.env.NODE_ENV === 'development') {
        (0, _log.warnLog)('vxe.error.scrollXNotGroup');
      }
    }

    if (scrollXLoad) {
      if (process.env.NODE_ENV === 'development') {
        if (this.showHeader && !this.showHeaderOverflow) {
          (0, _log.warnLog)('vxe.error.reqProp', ['show-header-overflow']);
        }

        if (this.showFooter && !this.showFooterOverflow) {
          (0, _log.warnLog)('vxe.error.reqProp', ['show-footer-overflow']);
        }

        if (this.spanMethod) {
          (0, _log.warnLog)('vxe.error.scrollErrProp', ['span-method']);
        }

        if (this.footerSpanMethod) {
          (0, _log.warnLog)('vxe.error.scrollErrProp', ['footer-span-method']);
        }
      }

      var _computeVirtualX = computeVirtualX(this),
          visibleSize = _computeVirtualX.visibleSize;

      scrollXStore.startIndex = 0;
      scrollXStore.endIndex = visibleSize;
      scrollXStore.visibleSize = visibleSize;
    } // 如果列被显示/隐藏，则清除合并状态
    // 如果列被设置为固定，则清除合并状态


    if (visibleColumn.length !== this.visibleColumn.length || !this.visibleColumn.every(function (column, index) {
      return column === visibleColumn[index];
    })) {
      this.clearMergeCells();
      this.clearMergeFooterItems();
    }

    this.scrollXLoad = scrollXLoad;
    this.visibleColumn = visibleColumn;
    this.handleTableColumn();
    return this.updateFooter().then(function () {
      return _this21.recalculate();
    }).then(function () {
      _this21.updateCellAreas();

      return _this21.recalculate();
    });
  },

  /**
   * 指定列宽的列进行拆分
   */
  analyColumnWidth: function analyColumnWidth() {
    var columnOpts = this.columnOpts;
    var defaultWidth = columnOpts.width,
        defaultMinWidth = columnOpts.minWidth;
    var resizeList = [];
    var pxList = [];
    var pxMinList = [];
    var scaleList = [];
    var scaleMinList = [];
    var autoList = [];
    this.tableFullColumn.forEach(function (column) {
      if (defaultWidth && !column.width) {
        column.width = defaultWidth;
      }

      if (defaultMinWidth && !column.minWidth) {
        column.minWidth = defaultMinWidth;
      }

      if (column.visible) {
        if (column.resizeWidth) {
          resizeList.push(column);
        } else if (_dom.default.isPx(column.width)) {
          pxList.push(column);
        } else if (_dom.default.isScale(column.width)) {
          scaleList.push(column);
        } else if (_dom.default.isPx(column.minWidth)) {
          pxMinList.push(column);
        } else if (_dom.default.isScale(column.minWidth)) {
          scaleMinList.push(column);
        } else {
          autoList.push(column);
        }
      }
    });
    Object.assign(this.columnStore, {
      resizeList: resizeList,
      pxList: pxList,
      pxMinList: pxMinList,
      scaleList: scaleList,
      scaleMinList: scaleMinList,
      autoList: autoList
    });
  },

  /**
   * 刷新滚动操作，手动同步滚动相关位置（对于某些特殊的操作，比如滚动条错位、固定列不同步）
   */
  refreshScroll: function refreshScroll() {
    var _this22 = this;

    var lastScrollLeft = this.lastScrollLeft,
        lastScrollTop = this.lastScrollTop;
    var $refs = this.$refs;
    var tableBody = $refs.tableBody,
        leftBody = $refs.leftBody,
        rightBody = $refs.rightBody,
        tableFooter = $refs.tableFooter;
    var tableBodyElem = tableBody ? tableBody.$el : null;
    var leftBodyElem = leftBody ? leftBody.$el : null;
    var rightBodyElem = rightBody ? rightBody.$el : null;
    var tableFooterElem = tableFooter ? tableFooter.$el : null;
    return new Promise(function (resolve) {
      // 还原滚动条位置
      if (lastScrollLeft || lastScrollTop) {
        return (0, _util.restoreScrollLocation)(_this22, lastScrollLeft, lastScrollTop).then(function () {
          // 存在滚动行为未结束情况
          setTimeout(resolve, 30);
        });
      } // 重置


      (0, _dom.setScrollTop)(tableBodyElem, lastScrollTop);
      (0, _dom.setScrollTop)(leftBodyElem, lastScrollTop);
      (0, _dom.setScrollTop)(rightBodyElem, lastScrollTop);
      (0, _dom.setScrollLeft)(tableFooterElem, lastScrollLeft); // 存在滚动行为未结束情况

      setTimeout(resolve, 30);
    });
  },

  /**
   * 计算单元格列宽，动态分配可用剩余空间
   * 支持 width=? width=?px width=?% min-width=? min-width=?px min-width=?%
   */
  recalculate: function recalculate(refull) {
    var _this23 = this;

    var $refs = this.$refs;
    var tableBody = $refs.tableBody,
        tableHeader = $refs.tableHeader,
        tableFooter = $refs.tableFooter;
    var bodyElem = tableBody ? tableBody.$el : null;
    var headerElem = tableHeader ? tableHeader.$el : null;
    var footerElem = tableFooter ? tableFooter.$el : null;

    if (bodyElem) {
      this.autoCellWidth(headerElem, bodyElem, footerElem);

      if (refull === true) {
        // 初始化时需要在列计算之后再执行优化运算，达到最优显示效果
        return this.computeScrollLoad().then(function () {
          _this23.autoCellWidth(headerElem, bodyElem, footerElem);

          return _this23.computeScrollLoad();
        });
      }
    }

    return this.computeScrollLoad();
  },

  /**
   * 列宽算法
   * 支持 px、%、固定 混合分配
   * 支持动态列表调整分配
   * 支持自动分配偏移量
   * @param {Element} headerElem
   * @param {Element} bodyElem
   * @param {Element} footerElem
   * @param {Number} bodyWidth
   */
  autoCellWidth: function autoCellWidth(headerElem, bodyElem, footerElem) {
    var tableWidth = 0;
    var minCellWidth = 40; // 列宽最少限制 40px

    var bodyWidth = bodyElem.clientWidth - 1;
    var remainWidth = bodyWidth;
    var meanWidth = remainWidth / 100;
    var fit = this.fit,
        columnStore = this.columnStore;
    var resizeList = columnStore.resizeList,
        pxMinList = columnStore.pxMinList,
        pxList = columnStore.pxList,
        scaleList = columnStore.scaleList,
        scaleMinList = columnStore.scaleMinList,
        autoList = columnStore.autoList; // 最小宽

    pxMinList.forEach(function (column) {
      var minWidth = parseInt(column.minWidth);
      tableWidth += minWidth;
      column.renderWidth = minWidth;
    }); // 最小百分比

    scaleMinList.forEach(function (column) {
      var scaleWidth = Math.floor(parseInt(column.minWidth) * meanWidth);
      tableWidth += scaleWidth;
      column.renderWidth = scaleWidth;
    }); // 固定百分比

    scaleList.forEach(function (column) {
      var scaleWidth = Math.floor(parseInt(column.width) * meanWidth);
      tableWidth += scaleWidth;
      column.renderWidth = scaleWidth;
    }); // 固定宽

    pxList.forEach(function (column) {
      var width = parseInt(column.width);
      tableWidth += width;
      column.renderWidth = width;
    }); // 调整了列宽

    resizeList.forEach(function (column) {
      var width = parseInt(column.resizeWidth);
      tableWidth += width;
      column.renderWidth = width;
    });
    remainWidth -= tableWidth;
    meanWidth = remainWidth > 0 ? Math.floor(remainWidth / (scaleMinList.length + pxMinList.length + autoList.length)) : 0;

    if (fit) {
      if (remainWidth > 0) {
        scaleMinList.concat(pxMinList).forEach(function (column) {
          tableWidth += meanWidth;
          column.renderWidth += meanWidth;
        });
      }
    } else {
      meanWidth = minCellWidth;
    } // 自适应


    autoList.forEach(function (column) {
      var width = Math.max(meanWidth, minCellWidth);
      column.renderWidth = width;
      tableWidth += width;
    });

    if (fit) {
      /**
       * 偏移量算法
       * 如果所有列足够放的情况下，从最后动态列开始分配
       */
      var dynamicList = scaleList.concat(scaleMinList).concat(pxMinList).concat(autoList);
      var dynamicSize = dynamicList.length - 1;

      if (dynamicSize > 0) {
        var odiffer = bodyWidth - tableWidth;

        if (odiffer > 0) {
          while (odiffer > 0 && dynamicSize >= 0) {
            odiffer--;
            dynamicList[dynamicSize--].renderWidth++;
          }

          tableWidth = bodyWidth;
        }
      }
    }

    var tableHeight = bodyElem.offsetHeight;
    var overflowY = bodyElem.scrollHeight > bodyElem.clientHeight;
    this.scrollbarWidth = overflowY ? bodyElem.offsetWidth - bodyElem.clientWidth : 0;
    this.overflowY = overflowY;
    this.tableWidth = tableWidth;
    this.tableHeight = tableHeight;

    if (headerElem) {
      this.headerHeight = headerElem.clientHeight;
      this.$nextTick(function () {
        // 检测是否同步滚动
        if (headerElem && bodyElem && headerElem.scrollLeft !== bodyElem.scrollLeft) {
          headerElem.scrollLeft = bodyElem.scrollLeft;
        }
      });
    } else {
      this.headerHeight = 0;
    }

    if (footerElem) {
      var footerHeight = footerElem.offsetHeight;
      this.scrollbarHeight = Math.max(footerHeight - footerElem.clientHeight, 0);
      this.overflowX = tableWidth > footerElem.clientWidth;
      this.footerHeight = footerHeight;
    } else {
      this.footerHeight = 0;
      this.scrollbarHeight = Math.max(tableHeight - bodyElem.clientHeight, 0);
      this.overflowX = tableWidth > bodyWidth;
    }

    this.updateHeight();
    this.parentHeight = Math.max(this.headerHeight + this.footerHeight + 20, this.getParentHeight());

    if (this.overflowX) {
      this.checkScrolling();
    }
  },
  updateHeight: function updateHeight() {
    this.customHeight = calcHeight(this, 'height');
    this.customMaxHeight = calcHeight(this, 'maxHeight');
  },
  updateStyle: function updateStyle() {
    var _this24 = this;

    var $refs = this.$refs,
        isGroup = this.isGroup,
        fullColumnIdData = this.fullColumnIdData,
        tableColumn = this.tableColumn,
        customHeight = this.customHeight,
        customMaxHeight = this.customMaxHeight,
        border = this.border,
        headerHeight = this.headerHeight,
        showFooter = this.showFooter,
        allColumnOverflow = this.showOverflow,
        allColumnHeaderOverflow = this.showHeaderOverflow,
        allColumnFooterOverflow = this.showFooterOverflow,
        footerHeight = this.footerHeight,
        tableHeight = this.tableHeight,
        tableWidth = this.tableWidth,
        scrollbarHeight = this.scrollbarHeight,
        scrollbarWidth = this.scrollbarWidth,
        scrollXLoad = this.scrollXLoad,
        scrollYLoad = this.scrollYLoad,
        cellOffsetWidth = this.cellOffsetWidth,
        columnStore = this.columnStore,
        elemStore = this.elemStore,
        editStore = this.editStore,
        currentRow = this.currentRow,
        mouseConfig = this.mouseConfig,
        keyboardConfig = this.keyboardConfig,
        keyboardOpts = this.keyboardOpts,
        spanMethod = this.spanMethod,
        mergeList = this.mergeList,
        mergeFooterList = this.mergeFooterList,
        footerSpanMethod = this.footerSpanMethod,
        isAllOverflow = this.isAllOverflow,
        visibleColumn = this.visibleColumn;
    var containerList = ['main', 'left', 'right'];
    var emptyPlaceholderElem = $refs.emptyPlaceholder;
    var bodyWrapperElem = elemStore['main-body-wrapper'];

    if (emptyPlaceholderElem) {
      emptyPlaceholderElem.style.top = "".concat(headerHeight, "px");
      emptyPlaceholderElem.style.height = bodyWrapperElem ? "".concat(bodyWrapperElem.offsetHeight - scrollbarHeight, "px") : '';
    }

    if (customHeight > 0) {
      if (showFooter) {
        customHeight += scrollbarHeight;
      }
    }

    containerList.forEach(function (name, index) {
      var fixedType = index > 0 ? name : '';
      var layoutList = ['header', 'body', 'footer'];
      var fixedColumn = columnStore["".concat(fixedType, "List")];
      var fixedWrapperElem = $refs["".concat(fixedType, "Container")];
      layoutList.forEach(function (layout) {
        var wrapperElem = elemStore["".concat(name, "-").concat(layout, "-wrapper")];
        var tableElem = elemStore["".concat(name, "-").concat(layout, "-table")];

        if (layout === 'header') {
          // 表头体样式处理
          // 横向滚动渲染
          var tWidth = tableWidth; // 如果是使用优化模式

          var isOptimize = false;

          if (!isGroup) {
            if (fixedType) {
              if (scrollXLoad || allColumnHeaderOverflow) {
                isOptimize = true;
              }
            }
          }

          if (isOptimize) {
            tableColumn = fixedColumn;
          }

          if (isOptimize || scrollXLoad) {
            tWidth = tableColumn.reduce(function (previous, column) {
              return previous + column.renderWidth;
            }, 0);
          }

          if (tableElem) {
            tableElem.style.width = tWidth ? "".concat(tWidth + scrollbarWidth, "px") : ''; // 修复 IE 中高度无法自适应问题

            if (_dom.browse.msie) {
              _xeUtils.default.arrayEach(tableElem.querySelectorAll('.vxe-resizable'), function (resizeElem) {
                resizeElem.style.height = "".concat(resizeElem.parentNode.offsetHeight, "px");
              });
            }
          }

          var repairElem = elemStore["".concat(name, "-").concat(layout, "-repair")];

          if (repairElem) {
            repairElem.style.width = "".concat(tableWidth, "px");
          }

          var listElem = elemStore["".concat(name, "-").concat(layout, "-list")];

          if (isGroup && listElem) {
            _xeUtils.default.arrayEach(listElem.querySelectorAll('.col--group'), function (thElem) {
              var colNode = _this24.getColumnNode(thElem);

              if (colNode) {
                var column = colNode.item;
                var showHeaderOverflow = column.showHeaderOverflow;
                var cellOverflow = _xeUtils.default.isBoolean(showHeaderOverflow) ? showHeaderOverflow : allColumnHeaderOverflow;
                var showEllipsis = cellOverflow === 'ellipsis';
                var showTitle = cellOverflow === 'title';
                var showTooltip = cellOverflow === true || cellOverflow === 'tooltip';
                var hasEllipsis = showTitle || showTooltip || showEllipsis;
                var childWidth = 0;
                var countChild = 0;

                if (hasEllipsis) {
                  _xeUtils.default.eachTree(column.children, function (item) {
                    if (!item.children || !column.children.length) {
                      countChild++;
                    }

                    childWidth += item.renderWidth;
                  });
                }

                thElem.style.width = hasEllipsis ? "".concat(childWidth - countChild - (border ? 2 : 0), "px") : '';
              }
            });
          }
        } else if (layout === 'body') {
          var emptyBlockElem = elemStore["".concat(name, "-").concat(layout, "-emptyBlock")];

          if (isNodeElement(wrapperElem)) {
            if (customMaxHeight) {
              wrapperElem.style.maxHeight = "".concat(fixedType ? customMaxHeight - headerHeight - (showFooter ? 0 : scrollbarHeight) : customMaxHeight - headerHeight, "px");
            } else {
              if (customHeight > 0) {
                wrapperElem.style.height = "".concat(fixedType ? (customHeight > 0 ? customHeight - headerHeight - footerHeight : tableHeight) - (showFooter ? 0 : scrollbarHeight) : customHeight - headerHeight - footerHeight, "px");
              } else {
                wrapperElem.style.height = '';
              }
            }
          } // 如果是固定列


          if (fixedWrapperElem) {
            var isRightFixed = fixedType === 'right';
            var _fixedColumn = columnStore["".concat(fixedType, "List")];

            if (isNodeElement(wrapperElem)) {
              wrapperElem.style.top = "".concat(headerHeight, "px");
            }

            fixedWrapperElem.style.height = "".concat((customHeight > 0 ? customHeight - headerHeight - footerHeight : tableHeight) + headerHeight + footerHeight - scrollbarHeight * (showFooter ? 2 : 1), "px");
            fixedWrapperElem.style.width = "".concat(_fixedColumn.reduce(function (previous, column) {
              return previous + column.renderWidth;
            }, isRightFixed ? scrollbarWidth : 0), "px");
          }

          var _tWidth = tableWidth; // 如果是使用优化模式

          if (fixedType) {
            if (scrollXLoad || scrollYLoad || (allColumnOverflow ? isAllOverflow : allColumnOverflow)) {
              if (!mergeList.length && !spanMethod && !(keyboardConfig && keyboardOpts.isMerge)) {
                tableColumn = fixedColumn;
              } else {
                tableColumn = visibleColumn;
              }
            } else {
              tableColumn = visibleColumn;
            }
          }

          _tWidth = tableColumn.reduce(function (previous, column) {
            return previous + column.renderWidth;
          }, 0);

          if (tableElem) {
            tableElem.style.width = _tWidth ? "".concat(_tWidth, "px") : ''; // 兼容性处理

            tableElem.style.paddingRight = scrollbarWidth && fixedType && (_dom.browse['-moz'] || _dom.browse.safari) ? "".concat(scrollbarWidth, "px") : '';
          }

          if (emptyBlockElem) {
            emptyBlockElem.style.width = _tWidth ? "".concat(_tWidth, "px") : '';
          }
        } else if (layout === 'footer') {
          var _tWidth2 = tableWidth; // 如果是使用优化模式

          if (fixedType) {
            if (scrollXLoad || allColumnFooterOverflow) {
              if (!mergeFooterList.length || !footerSpanMethod) {
                tableColumn = fixedColumn;
              } else {
                tableColumn = visibleColumn;
              }
            } else {
              tableColumn = visibleColumn;
            }
          }

          _tWidth2 = tableColumn.reduce(function (previous, column) {
            return previous + column.renderWidth;
          }, 0);

          if (isNodeElement(wrapperElem)) {
            // 如果是固定列
            if (fixedWrapperElem) {
              wrapperElem.style.top = "".concat(customHeight > 0 ? customHeight - footerHeight : tableHeight + headerHeight, "px");
            }

            wrapperElem.style.marginTop = "".concat(-scrollbarHeight, "px");
          }

          if (tableElem) {
            tableElem.style.width = _tWidth2 ? "".concat(_tWidth2 + scrollbarWidth, "px") : '';
          }
        }

        var colgroupElem = elemStore["".concat(name, "-").concat(layout, "-colgroup")];

        if (colgroupElem) {
          _xeUtils.default.arrayEach(colgroupElem.children, function (colElem) {
            var colid = colElem.getAttribute('name');

            if (colid === 'col_gutter') {
              colElem.style.width = "".concat(scrollbarWidth, "px");
            }

            if (fullColumnIdData[colid]) {
              var column = fullColumnIdData[colid].column;
              var showHeaderOverflow = column.showHeaderOverflow,
                  showFooterOverflow = column.showFooterOverflow,
                  showOverflow = column.showOverflow;
              var cellOverflow;
              colElem.style.width = "".concat(column.renderWidth, "px");

              if (layout === 'header') {
                cellOverflow = _xeUtils.default.isUndefined(showHeaderOverflow) || _xeUtils.default.isNull(showHeaderOverflow) ? allColumnHeaderOverflow : showHeaderOverflow;
              } else if (layout === 'footer') {
                cellOverflow = _xeUtils.default.isUndefined(showFooterOverflow) || _xeUtils.default.isNull(showFooterOverflow) ? allColumnFooterOverflow : showFooterOverflow;
              } else {
                cellOverflow = _xeUtils.default.isUndefined(showOverflow) || _xeUtils.default.isNull(showOverflow) ? allColumnOverflow : showOverflow;
              }

              var showEllipsis = cellOverflow === 'ellipsis';
              var showTitle = cellOverflow === 'title';
              var showTooltip = cellOverflow === true || cellOverflow === 'tooltip';
              var hasEllipsis = showTitle || showTooltip || showEllipsis;
              var _listElem = elemStore["".concat(name, "-").concat(layout, "-list")]; // 滚动的渲染不支持动态行高

              if (layout === 'header' || layout === 'footer') {
                if (scrollXLoad && !hasEllipsis) {
                  hasEllipsis = true;
                }
              } else {
                if ((scrollXLoad || scrollYLoad) && !hasEllipsis) {
                  hasEllipsis = true;
                }
              }

              if (_listElem) {
                _xeUtils.default.arrayEach(_listElem.querySelectorAll(".".concat(column.id)), function (elem) {
                  var colspan = parseInt(elem.getAttribute('colspan') || 1);
                  var cellElem = elem.querySelector('.vxe-cell');
                  var colWidth = column.renderWidth;

                  if (cellElem) {
                    if (colspan > 1) {
                      var columnIndex = _this24.getColumnIndex(column);

                      for (var _index = 1; _index < colspan; _index++) {
                        var nextColumn = _this24.getColumns(columnIndex + _index);

                        if (nextColumn) {
                          colWidth += nextColumn.renderWidth;
                        }
                      }
                    }

                    cellElem.style.width = hasEllipsis ? "".concat(colWidth - cellOffsetWidth * colspan, "px") : '';
                  }
                });
              }
            }
          });
        }
      });
    });

    if (currentRow) {
      this.setCurrentRow(currentRow);
    }

    if (mouseConfig && mouseConfig.selected && editStore.selected.row && editStore.selected.column) {
      this.addColSdCls();
    }

    return this.$nextTick();
  },

  /**
   * 处理固定列的显示状态
   */
  checkScrolling: function checkScrolling() {
    var _this$$refs = this.$refs,
        tableBody = _this$$refs.tableBody,
        leftContainer = _this$$refs.leftContainer,
        rightContainer = _this$$refs.rightContainer;
    var bodyElem = tableBody ? tableBody.$el : null;

    if (bodyElem) {
      if (leftContainer) {
        _dom.default[bodyElem.scrollLeft > 0 ? 'addClass' : 'removeClass'](leftContainer, 'scrolling--middle');
      }

      if (rightContainer) {
        _dom.default[bodyElem.clientWidth < bodyElem.scrollWidth - Math.ceil(bodyElem.scrollLeft) ? 'addClass' : 'removeClass'](rightContainer, 'scrolling--middle');
      }
    }
  },
  preventEvent: function preventEvent(evnt, type, args, next, end) {
    var _this25 = this;

    var evntList = _vXETable.default.interceptor.get(type);

    var rest;

    if (!evntList.some(function (func) {
      return func(Object.assign({
        $grid: _this25.$xegrid,
        $table: _this25,
        $event: evnt
      }, args)) === false;
    })) {
      if (next) {
        rest = next();
      }
    }

    if (end) {
      end();
    }

    return rest;
  },

  /**
   * 全局按下事件处理
   */
  handleGlobalMousedownEvent: function handleGlobalMousedownEvent(evnt) {
    var _this26 = this;

    var $el = this.$el,
        $refs = this.$refs,
        $xegrid = this.$xegrid,
        $toolbar = this.$toolbar,
        mouseConfig = this.mouseConfig,
        editStore = this.editStore,
        ctxMenuStore = this.ctxMenuStore,
        editOpts = this.editOpts,
        filterStore = this.filterStore,
        getRowNode = this.getRowNode;
    var actived = editStore.actived;
    var ctxWrapper = $refs.ctxWrapper,
        filterWrapper = $refs.filterWrapper,
        validTip = $refs.validTip;

    if (filterWrapper) {
      if (getEventTargetNode(evnt, $el, 'vxe-cell--filter').flag) {// 如果点击了筛选按钮
      } else if (getEventTargetNode(evnt, filterWrapper.$el).flag) {// 如果点击筛选容器
      } else {
        if (!getEventTargetNode(evnt, document.body, 'vxe-table--ignore-clear').flag) {
          this.preventEvent(evnt, 'event.clearFilter', filterStore.args, this.closeFilter);
        }
      }
    } // 如果已激活了编辑状态


    if (actived.row) {
      if (!(editOpts.autoClear === false)) {
        // 如果是激活状态，点击了单元格之外
        var cell = actived.args.cell;

        if (!cell || !getEventTargetNode(evnt, cell).flag) {
          if (validTip && getEventTargetNode(evnt, validTip.$el).flag) {// 如果是激活状态，且点击了校验提示框
          } else if (!this.lastCallTime || this.lastCallTime + 50 < Date.now()) {
            if (!getEventTargetNode(evnt, document.body, 'vxe-table--ignore-clear').flag) {
              // 如果手动调用了激活单元格，避免触发源被移除后导致重复关闭
              this.preventEvent(evnt, 'event.clearActived', actived.args, function () {
                var isClearActived;

                if (editOpts.mode === 'row') {
                  var rowNode = getEventTargetNode(evnt, $el, 'vxe-body--row'); // row 方式，如果点击了不同行

                  isClearActived = rowNode.flag ? getRowNode(rowNode.targetElem).item !== actived.args.row : false;
                } else {
                  // cell 方式，如果是非编辑列
                  isClearActived = !getEventTargetNode(evnt, $el, 'col--edit').flag;
                } // 如果点击表头行，则清除激活状态


                if (!isClearActived) {
                  isClearActived = getEventTargetNode(evnt, $el, 'vxe-header--row').flag;
                } // 如果点击表尾行，则清除激活状态


                if (!isClearActived) {
                  isClearActived = getEventTargetNode(evnt, $el, 'vxe-footer--row').flag;
                } // 如果固定了高度且点击了行之外的空白处，则清除激活状态


                if (!isClearActived && _this26.height && !_this26.overflowY) {
                  var bodyWrapperElem = evnt.target;

                  if (hasClass(bodyWrapperElem, 'vxe-table--body-wrapper')) {
                    isClearActived = evnt.offsetY < bodyWrapperElem.clientHeight;
                  }
                }

                if (isClearActived || // 如果点击了当前表格之外
                !getEventTargetNode(evnt, $el).flag) {
                  setTimeout(function () {
                    return _this26.clearActived(evnt);
                  });
                }
              });
            }
          }
        }
      }
    } else if (mouseConfig) {
      if (!getEventTargetNode(evnt, $el).flag && !($xegrid && getEventTargetNode(evnt, $xegrid.$el).flag) && !(ctxWrapper && getEventTargetNode(evnt, ctxWrapper.$el).flag) && !($toolbar && getEventTargetNode(evnt, $toolbar.$el).flag)) {
        this.clearSelected();

        if (!getEventTargetNode(evnt, document.body, 'vxe-table--ignore-areas-clear').flag) {
          this.preventEvent(evnt, 'event.clearAreas', {}, function () {
            _this26.clearCellAreas();

            _this26.clearCopyCellArea();
          });
        }
      }
    } // 如果配置了快捷菜单且，点击了其他地方则关闭


    if (ctxMenuStore.visible && ctxWrapper && !getEventTargetNode(evnt, ctxWrapper.$el).flag) {
      this.closeMenu();
    } // 最后激活的表格


    this.isActivated = getEventTargetNode(evnt, ($xegrid || this).$el).flag;
  },

  /**
   * 窗口失焦事件处理
   */
  handleGlobalBlurEvent: function handleGlobalBlurEvent() {
    this.closeFilter();
    this.closeMenu();
  },

  /**
   * 全局滚动事件
   */
  handleGlobalMousewheelEvent: function handleGlobalMousewheelEvent() {
    this.closeTooltip();
    this.closeMenu();
  },

  /**
   * 表格键盘事件
   */
  keydownEvent: function keydownEvent(evnt) {
    var _this27 = this;

    var filterStore = this.filterStore,
        ctxMenuStore = this.ctxMenuStore,
        editStore = this.editStore,
        keyboardConfig = this.keyboardConfig,
        mouseConfig = this.mouseConfig,
        mouseOpts = this.mouseOpts,
        keyboardOpts = this.keyboardOpts;
    var actived = editStore.actived;
    var keyCode = evnt.keyCode;
    var isEsc = keyCode === 27;

    if (isEsc) {
      this.preventEvent(evnt, 'event.keydown', null, function () {
        _this27.emitEvent('keydown-start', {}, evnt);

        if (keyboardConfig && mouseConfig && mouseOpts.area && _this27.handleKeyboardEvent) {
          _this27.handleKeyboardEvent(evnt);
        } else if (actived.row || filterStore.visible || ctxMenuStore.visible) {
          evnt.stopPropagation(); // 如果按下了 Esc 键，关闭快捷菜单、筛选

          _this27.closeFilter();

          _this27.closeMenu();

          if (keyboardConfig && keyboardOpts.isEsc) {
            // 如果是激活编辑状态，则取消编辑
            if (actived.row) {
              var params = actived.args;

              _this27.clearActived(evnt); // 如果配置了选中功能，则为选中状态


              if (mouseConfig && mouseOpts.selected) {
                _this27.$nextTick(function () {
                  return _this27.handleSelected(params, evnt);
                });
              }
            }
          }
        }

        _this27.emitEvent('keydown', {}, evnt);

        _this27.emitEvent('keydown-end', {}, evnt);
      });
    }
  },

  /**
   * 全局键盘事件
   */
  handleGlobalKeydownEvent: function handleGlobalKeydownEvent(evnt) {
    var _this28 = this;

    // 该行为只对当前激活的表格有效
    if (this.isActivated) {
      this.preventEvent(evnt, 'event.keydown', null, function () {
        var filterStore = _this28.filterStore,
            isCtxMenu = _this28.isCtxMenu,
            ctxMenuStore = _this28.ctxMenuStore,
            editStore = _this28.editStore,
            editOpts = _this28.editOpts,
            editConfig = _this28.editConfig,
            mouseConfig = _this28.mouseConfig,
            mouseOpts = _this28.mouseOpts,
            keyboardConfig = _this28.keyboardConfig,
            keyboardOpts = _this28.keyboardOpts,
            treeConfig = _this28.treeConfig,
            treeOpts = _this28.treeOpts,
            highlightCurrentRow = _this28.highlightCurrentRow,
            currentRow = _this28.currentRow,
            bodyCtxMenu = _this28.bodyCtxMenu,
            rowOpts = _this28.rowOpts;
        var selected = editStore.selected,
            actived = editStore.actived;
        var keyCode = evnt.keyCode;
        var isBack = keyCode === 8;
        var isTab = keyCode === 9;
        var isEnter = keyCode === 13;
        var isEsc = keyCode === 27;
        var isSpacebar = keyCode === 32;
        var isLeftArrow = keyCode === 37;
        var isUpArrow = keyCode === 38;
        var isRightArrow = keyCode === 39;
        var isDwArrow = keyCode === 40;
        var isDel = keyCode === 46;
        var isF2 = keyCode === 113;
        var isContextMenu = keyCode === 93;
        var hasMetaKey = evnt.metaKey;
        var hasCtrlKey = evnt.ctrlKey;
        var hasShiftKey = evnt.shiftKey;
        var hasAltKey = evnt.altKey;
        var operArrow = isLeftArrow || isUpArrow || isRightArrow || isDwArrow;
        var operCtxMenu = isCtxMenu && ctxMenuStore.visible && (isEnter || isSpacebar || operArrow);
        var isEditStatus = (0, _utils.isEnableConf)(editConfig) && actived.column && actived.row;
        var params;

        if (filterStore.visible) {
          if (isEsc) {
            _this28.closeFilter();
          }

          return;
        }

        if (operCtxMenu) {
          // 如果配置了右键菜单; 支持方向键操作、回车
          evnt.preventDefault();

          if (ctxMenuStore.showChild && hasChildrenList(ctxMenuStore.selected)) {
            _this28.moveCtxMenu(evnt, keyCode, ctxMenuStore, 'selectChild', 37, false, ctxMenuStore.selected.children);
          } else {
            _this28.moveCtxMenu(evnt, keyCode, ctxMenuStore, 'selected', 39, true, _this28.ctxMenuList);
          }
        } else if (keyboardConfig && mouseConfig && mouseOpts.area && _this28.handleKeyboardEvent) {
          _this28.handleKeyboardEvent(evnt);
        } else if (keyboardConfig && isSpacebar && keyboardOpts.isChecked && selected.row && selected.column && (selected.column.type === 'checkbox' || selected.column.type === 'radio')) {
          // 空格键支持选中复选框
          evnt.preventDefault();

          if (selected.column.type === 'checkbox') {
            _this28.handleToggleCheckRowEvent(evnt, selected.args);
          } else {
            _this28.triggerRadioRowEvent(evnt, selected.args);
          }
        } else if (isF2 && (0, _utils.isEnableConf)(editConfig)) {
          if (!isEditStatus) {
            // 如果按下了 F2 键
            if (selected.row && selected.column) {
              evnt.stopPropagation();
              evnt.preventDefault();

              _this28.handleActived(selected.args, evnt);
            }
          }
        } else if (isContextMenu) {
          // 如果按下上下文键
          _this28._keyCtx = selected.row && selected.column && bodyCtxMenu.length;
          clearTimeout(_this28.keyCtxTimeout);
          _this28.keyCtxTimeout = setTimeout(function () {
            _this28._keyCtx = false;
          }, 1000);
        } else if (isEnter && !hasAltKey && keyboardConfig && keyboardOpts.isEnter && (selected.row || actived.row || treeConfig && (rowOpts.isCurrent || highlightCurrentRow) && currentRow)) {
          // 退出选中
          if (hasCtrlKey) {
            // 如果是激活编辑状态，则取消编辑
            if (actived.row) {
              params = actived.args;

              _this28.clearActived(evnt); // 如果配置了选中功能，则为选中状态


              if (mouseConfig && mouseOpts.selected) {
                _this28.$nextTick(function () {
                  return _this28.handleSelected(params, evnt);
                });
              }
            }
          } else {
            // 如果是激活状态，退则出到上一行/下一行
            if (selected.row || actived.row) {
              var targetArgs = selected.row ? selected.args : actived.args;

              if (hasShiftKey) {
                if (keyboardOpts.enterToTab) {
                  _this28.moveTabSelected(targetArgs, hasShiftKey, evnt);
                } else {
                  _this28.moveSelected(targetArgs, isLeftArrow, true, isRightArrow, false, evnt);
                }
              } else {
                if (keyboardOpts.enterToTab) {
                  _this28.moveTabSelected(targetArgs, hasShiftKey, evnt);
                } else {
                  _this28.moveSelected(targetArgs, isLeftArrow, false, isRightArrow, true, evnt);
                }
              }
            } else if (treeConfig && (rowOpts.isCurrent || highlightCurrentRow) && currentRow) {
              // 如果是树形表格当前行回车移动到子节点
              var childrens = currentRow[treeOpts.children];

              if (childrens && childrens.length) {
                evnt.preventDefault();
                var targetRow = childrens[0];
                params = {
                  $table: _this28,
                  row: targetRow
                };

                _this28.setTreeExpand(currentRow, true).then(function () {
                  return _this28.scrollToRow(targetRow);
                }).then(function () {
                  return _this28.triggerCurrentRowEvent(evnt, params);
                });
              }
            }
          }
        } else if (operArrow && keyboardConfig && keyboardOpts.isArrow) {
          if (!isEditStatus) {
            // 如果按下了方向键
            if (selected.row && selected.column) {
              _this28.moveSelected(selected.args, isLeftArrow, isUpArrow, isRightArrow, isDwArrow, evnt);
            } else if ((isUpArrow || isDwArrow) && (rowOpts.isCurrent || highlightCurrentRow)) {
              // 当前行按键上下移动
              _this28.moveCurrentRow(isUpArrow, isDwArrow, evnt);
            }
          }
        } else if (isTab && keyboardConfig && keyboardOpts.isTab) {
          // 如果按下了 Tab 键切换
          if (selected.row || selected.column) {
            _this28.moveTabSelected(selected.args, hasShiftKey, evnt);
          } else if (actived.row || actived.column) {
            _this28.moveTabSelected(actived.args, hasShiftKey, evnt);
          }
        } else if (keyboardConfig && (isDel || (treeConfig && (rowOpts.isCurrent || highlightCurrentRow) && currentRow ? isBack && keyboardOpts.isArrow : isBack))) {
          if (!isEditStatus) {
            var delMethod = keyboardOpts.delMethod,
                backMethod = keyboardOpts.backMethod; // 如果是删除键

            if (keyboardOpts.isDel && (selected.row || selected.column)) {
              if (delMethod) {
                delMethod({
                  row: selected.row,
                  rowIndex: _this28.getRowIndex(selected.row),
                  column: selected.column,
                  columnIndex: _this28.getColumnIndex(selected.column),
                  $table: _this28
                });
              } else {
                setCellValue(selected.row, selected.column, null);
              }

              if (isBack) {
                if (backMethod) {
                  backMethod({
                    row: selected.row,
                    rowIndex: _this28.getRowIndex(selected.row),
                    column: selected.column,
                    columnIndex: _this28.getColumnIndex(selected.column),
                    $table: _this28
                  });
                } else {
                  _this28.handleActived(selected.args, evnt);
                }
              } else if (isDel) {
                // 如果按下 del 键，更新表尾数据
                _this28.updateFooter();
              }
            } else if (isBack && keyboardOpts.isArrow && treeConfig && (rowOpts.isCurrent || highlightCurrentRow) && currentRow) {
              // 如果树形表格回退键关闭当前行返回父节点
              var _XEUtils$findTree = _xeUtils.default.findTree(_this28.afterFullData, function (item) {
                return item === currentRow;
              }, treeOpts),
                  parentRow = _XEUtils$findTree.parent;

              if (parentRow) {
                evnt.preventDefault();
                params = {
                  $table: _this28,
                  row: parentRow
                };

                _this28.setTreeExpand(parentRow, false).then(function () {
                  return _this28.scrollToRow(parentRow);
                }).then(function () {
                  return _this28.triggerCurrentRowEvent(evnt, params);
                });
              }
            }
          }
        } else if (keyboardConfig && keyboardOpts.isEdit && !hasCtrlKey && !hasMetaKey && (isSpacebar || keyCode >= 48 && keyCode <= 57 || keyCode >= 65 && keyCode <= 90 || keyCode >= 96 && keyCode <= 111 || keyCode >= 186 && keyCode <= 192 || keyCode >= 219 && keyCode <= 222)) {
          var editMethod = keyboardOpts.editMethod; // 启用编辑后，空格键功能将失效
          // if (isSpacebar) {
          //   evnt.preventDefault()
          // }
          // 如果是按下非功能键之外允许直接编辑

          if (selected.column && selected.row && (0, _utils.isEnableConf)(selected.column.editRender)) {
            if (!editOpts.activeMethod || editOpts.activeMethod(_objectSpread(_objectSpread({}, selected.args), {}, {
              $table: _this28
            }))) {
              if (editMethod) {
                editMethod({
                  row: selected.row,
                  rowIndex: _this28.getRowIndex(selected.row),
                  column: selected.column,
                  columnIndex: _this28.getColumnIndex(selected.column),
                  $table: _this28
                });
              } else {
                setCellValue(selected.row, selected.column, null);

                _this28.handleActived(selected.args, evnt);
              }
            }
          }
        }

        _this28.emitEvent('keydown', {}, evnt);
      });
    }
  },
  handleGlobalPasteEvent: function handleGlobalPasteEvent(evnt) {
    var isActivated = this.isActivated,
        keyboardConfig = this.keyboardConfig,
        keyboardOpts = this.keyboardOpts,
        mouseConfig = this.mouseConfig,
        mouseOpts = this.mouseOpts,
        editStore = this.editStore,
        filterStore = this.filterStore;
    var actived = editStore.actived;

    if (isActivated && !filterStore.visible) {
      if (!(actived.row || actived.column)) {
        if (keyboardConfig && keyboardOpts.isClip && mouseConfig && mouseOpts.area && this.handlePasteCellAreaEvent) {
          this.handlePasteCellAreaEvent(evnt);
        }
      }

      this.emitEvent('paste', {}, evnt);
    }
  },
  handleGlobalCopyEvent: function handleGlobalCopyEvent(evnt) {
    var isActivated = this.isActivated,
        keyboardConfig = this.keyboardConfig,
        keyboardOpts = this.keyboardOpts,
        mouseConfig = this.mouseConfig,
        mouseOpts = this.mouseOpts,
        editStore = this.editStore,
        filterStore = this.filterStore;
    var actived = editStore.actived;

    if (isActivated && !filterStore.visible) {
      if (!(actived.row || actived.column)) {
        if (keyboardConfig && keyboardOpts.isClip && mouseConfig && mouseOpts.area && this.handleCopyCellAreaEvent) {
          this.handleCopyCellAreaEvent(evnt);
        }
      }

      this.emitEvent('copy', {}, evnt);
    }
  },
  handleGlobalCutEvent: function handleGlobalCutEvent(evnt) {
    var isActivated = this.isActivated,
        keyboardConfig = this.keyboardConfig,
        keyboardOpts = this.keyboardOpts,
        mouseConfig = this.mouseConfig,
        mouseOpts = this.mouseOpts,
        editStore = this.editStore,
        filterStore = this.filterStore;
    var actived = editStore.actived;

    if (isActivated && !filterStore.visible) {
      if (!(actived.row || actived.column)) {
        if (keyboardConfig && keyboardOpts.isClip && mouseConfig && mouseOpts.area && this.handleCutCellAreaEvent) {
          this.handleCutCellAreaEvent(evnt);
        }
      }

      this.emitEvent('cut', {}, evnt);
    }
  },
  handleGlobalResizeEvent: function handleGlobalResizeEvent() {
    this.closeMenu();
    this.updateCellAreas();
    this.recalculate(true);
  },
  handleTargetEnterEvent: function handleTargetEnterEvent(isClear) {
    var $tooltip = this.$refs.tooltip;
    clearTimeout(this.tooltipTimeout);

    if (isClear) {
      this.closeTooltip();
    } else {
      if ($tooltip) {
        $tooltip.setActived(true);
      }
    }
  },
  handleTargetLeaveEvent: function handleTargetLeaveEvent() {
    var _this29 = this;

    var tooltipOpts = this.tooltipOpts;
    var $tooltip = this.$refs.tooltip;

    if ($tooltip) {
      $tooltip.setActived(false);
    }

    if (tooltipOpts.enterable) {
      this.tooltipTimeout = setTimeout(function () {
        $tooltip = _this29.$refs.tooltip;

        if ($tooltip && !$tooltip.isActived()) {
          _this29.closeTooltip();
        }
      }, tooltipOpts.leaveDelay);
    } else {
      this.closeTooltip();
    }
  },
  triggerHeaderHelpEvent: function triggerHeaderHelpEvent(evnt, params) {
    var column = params.column;
    var titlePrefix = column.titlePrefix || column.titleHelp;

    if (titlePrefix.content || titlePrefix.message) {
      var $refs = this.$refs,
          tooltipStore = this.tooltipStore;
      var content = (0, _utils.getFuncText)(titlePrefix.content || titlePrefix.message);
      this.handleTargetEnterEvent(true);
      tooltipStore.visible = true;
      tooltipStore.currOpts = _objectSpread(_objectSpread({}, titlePrefix), {}, {
        content: null
      });
      this.$nextTick(function () {
        var $tooltip = $refs.tooltip;

        if ($tooltip) {
          $tooltip.open(evnt.currentTarget, content);
        }
      });
    }
  },

  /**
   * 触发表头 tooltip 事件
   */
  triggerHeaderTooltipEvent: function triggerHeaderTooltipEvent(evnt, params) {
    var tooltipStore = this.tooltipStore;
    var column = params.column;
    var titleElem = evnt.currentTarget;
    this.handleTargetEnterEvent(tooltipStore.column !== column || tooltipStore.row);

    if (tooltipStore.column !== column || !tooltipStore.visible) {
      this.handleTooltip(evnt, titleElem, titleElem, null, params);
    }
  },

  /**
   * 触发单元格 tooltip 事件
   */
  triggerBodyTooltipEvent: function triggerBodyTooltipEvent(evnt, params) {
    var editConfig = this.editConfig,
        editOpts = this.editOpts,
        editStore = this.editStore,
        tooltipStore = this.tooltipStore;
    var actived = editStore.actived;
    var row = params.row,
        column = params.column;
    var cell = evnt.currentTarget;
    this.handleTargetEnterEvent(tooltipStore.column !== column || tooltipStore.row !== row);

    if ((0, _utils.isEnableConf)(editConfig)) {
      if (editOpts.mode === 'row' && actived.row === row || actived.row === row && actived.column === column) {
        return;
      }
    }

    if (tooltipStore.column !== column || tooltipStore.row !== row || !tooltipStore.visible) {
      var overflowElem;
      var tipElem;

      if (column.treeNode) {
        overflowElem = cell.querySelector('.vxe-tree-cell');

        if (column.type === 'html') {
          tipElem = cell.querySelector('.vxe-cell--html');
        }
      } else {
        tipElem = cell.querySelector(column.type === 'html' ? '.vxe-cell--html' : '.vxe-cell--label');
      }

      this.handleTooltip(evnt, cell, overflowElem || cell.children[0], tipElem, params);
    }
  },

  /**
   * 触发表尾 tooltip 事件
   */
  triggerFooterTooltipEvent: function triggerFooterTooltipEvent(evnt, params) {
    var column = params.column;
    var tooltipStore = this.tooltipStore;
    var cell = evnt.currentTarget;
    this.handleTargetEnterEvent(true);

    if (tooltipStore.column !== column || !tooltipStore.visible) {
      this.handleTooltip(evnt, cell, cell.querySelector('.vxe-cell--item') || cell.children[0], null, params);
    }
  },

  /**
   * 处理显示 tooltip
   * @param {Event} evnt 事件
   * @param {ColumnInfo} column 列配置
   * @param {Row} row 行对象
   */
  handleTooltip: function handleTooltip(evnt, cell, overflowElem, tipElem, params) {
    params.cell = cell;
    var $refs = this.$refs,
        tooltipOpts = this.tooltipOpts,
        tooltipStore = this.tooltipStore;
    var column = params.column,
        row = params.row;
    var showAll = tooltipOpts.showAll,
        enabled = tooltipOpts.enabled,
        contentMethod = tooltipOpts.contentMethod;
    var customContent = contentMethod ? contentMethod(params) : null;
    var useCustom = contentMethod && !_xeUtils.default.eqNull(customContent);
    var content = useCustom ? customContent : (column.type === 'html' ? overflowElem.innerText : overflowElem.textContent).trim();
    var isCellOverflow = overflowElem.scrollWidth > overflowElem.clientWidth;

    if (content && (showAll || enabled || useCustom || isCellOverflow)) {
      Object.assign(tooltipStore, {
        row: row,
        column: column,
        visible: true,
        currOpts: null
      });
      this.$nextTick(function () {
        var $tooltip = $refs.tooltip;

        if ($tooltip) {
          $tooltip.open(isCellOverflow ? overflowElem : tipElem || overflowElem, _utils.default.formatText(content));
        }
      });
    }

    return this.$nextTick();
  },
  openTooltip: function openTooltip(target, content) {
    var $refs = this.$refs;
    var commTip = $refs.commTip;

    if (commTip) {
      return commTip.open(target, content);
    }

    return this.$nextTick();
  },

  /**
   * 关闭 tooltip
   */
  closeTooltip: function closeTooltip() {
    var $refs = this.$refs,
        tooltipStore = this.tooltipStore;
    var tooltip = $refs.tooltip;
    var commTip = $refs.commTip;

    if (tooltipStore.visible) {
      Object.assign(tooltipStore, {
        row: null,
        column: null,
        content: null,
        visible: false,
        currOpts: null
      });

      if (tooltip) {
        tooltip.close();
      }
    }

    if (commTip) {
      commTip.close();
    }

    return this.$nextTick();
  },

  /**
   * 判断列头复选框是否被选中
   */
  isAllCheckboxChecked: function isAllCheckboxChecked() {
    return this.isAllSelected;
  },

  /**
   * 判断列头复选框是否被半选
   */
  isAllCheckboxIndeterminate: function isAllCheckboxIndeterminate() {
    return !this.isAllSelected && this.isIndeterminate;
  },
  isCheckboxIndeterminate: function isCheckboxIndeterminate() {
    (0, _log.warnLog)('vxe.error.delFunc', ['isCheckboxIndeterminate', 'isAllCheckboxIndeterminate']);
    return this.isAllCheckboxIndeterminate();
  },

  /**
   * 获取复选框半选状态的行数据
   */
  getCheckboxIndeterminateRecords: function getCheckboxIndeterminateRecords(isFull) {
    var treeConfig = this.treeConfig,
        treeIndeterminates = this.treeIndeterminates,
        afterFullData = this.afterFullData;

    if (treeConfig) {
      return isFull ? treeIndeterminates.slice(0) : treeIndeterminates.filter(function (row) {
        return afterFullData.indexOf(row);
      });
    }

    return [];
  },

  /**
   * 处理默认勾选
   */
  handleDefaultSelectionChecked: function handleDefaultSelectionChecked() {
    var fullDataRowIdData = this.fullDataRowIdData,
        checkboxOpts = this.checkboxOpts;
    var checkAll = checkboxOpts.checkAll,
        checkRowKeys = checkboxOpts.checkRowKeys;

    if (checkAll) {
      this.setAllCheckboxRow(true);
    } else if (checkRowKeys) {
      var defSelection = [];
      checkRowKeys.forEach(function (rowid) {
        if (fullDataRowIdData[rowid]) {
          defSelection.push(fullDataRowIdData[rowid].row);
        }
      });
      this.setCheckboxRow(defSelection, true);
    }
  },

  /**
   * 用于多选行，设置行为选中状态，第二个参数为选中与否
   * @param {Array/Row} rows 行数据
   * @param {Boolean} value 是否选中
   */
  setCheckboxRow: function setCheckboxRow(rows, value) {
    var _this30 = this;

    if (rows && !_xeUtils.default.isArray(rows)) {
      rows = [rows];
    }

    rows.forEach(function (row) {
      return _this30.handleSelectRow({
        row: row
      }, !!value);
    });
    return this.$nextTick();
  },
  isCheckedByCheckboxRow: function isCheckedByCheckboxRow(row) {
    var property = this.checkboxOpts.checkField;

    if (property) {
      return _xeUtils.default.get(row, property);
    }

    return this.selection.indexOf(row) > -1;
  },
  isIndeterminateByCheckboxRow: function isIndeterminateByCheckboxRow(row) {
    return this.treeIndeterminates.indexOf(row) > -1 && !this.isCheckedByCheckboxRow(row);
  },

  /**
   * 多选，行选中事件
   * value 选中true 不选false 半选-1
   */
  handleSelectRow: function handleSelectRow(_ref6, value) {
    var _this31 = this;

    var row = _ref6.row;
    var selection = this.selection,
        afterFullData = this.afterFullData,
        treeConfig = this.treeConfig,
        treeOpts = this.treeOpts,
        treeIndeterminates = this.treeIndeterminates,
        checkboxOpts = this.checkboxOpts;
    var property = checkboxOpts.checkField,
        checkStrictly = checkboxOpts.checkStrictly,
        checkMethod = checkboxOpts.checkMethod;

    if (property) {
      if (treeConfig && !checkStrictly) {
        if (value === -1) {
          if (treeIndeterminates.indexOf(row) === -1) {
            treeIndeterminates.push(row);
          }

          _xeUtils.default.set(row, property, false);
        } else {
          // 更新子节点状态
          _xeUtils.default.eachTree([row], function (item) {
            if (row === item || !checkMethod || checkMethod({
              row: item
            })) {
              _xeUtils.default.set(item, property, value);

              _xeUtils.default.remove(treeIndeterminates, function (half) {
                return half === item;
              });

              _this31.handleCheckboxReserveRow(row, value);
            }
          }, treeOpts);
        } // 如果存在父节点，更新父节点状态


        var matchObj = _xeUtils.default.findTree(afterFullData, function (item) {
          return item === row;
        }, treeOpts);

        if (matchObj && matchObj.parent) {
          var parentStatus;
          var vItems = checkMethod ? matchObj.items.filter(function (item) {
            return checkMethod({
              row: item
            });
          }) : matchObj.items;

          var indeterminatesItem = _xeUtils.default.find(matchObj.items, function (item) {
            return treeIndeterminates.indexOf(item) > -1;
          });

          if (indeterminatesItem) {
            parentStatus = -1;
          } else {
            var selectItems = matchObj.items.filter(function (item) {
              return _xeUtils.default.get(item, property);
            });
            parentStatus = selectItems.filter(function (item) {
              return vItems.indexOf(item) > -1;
            }).length === vItems.length ? true : selectItems.length || value === -1 ? -1 : false;
          }

          return this.handleSelectRow({
            row: matchObj.parent
          }, parentStatus);
        }
      } else {
        if (!checkMethod || checkMethod({
          row: row
        })) {
          _xeUtils.default.set(row, property, value);

          this.handleCheckboxReserveRow(row, value);
        }
      }
    } else {
      if (treeConfig && !checkStrictly) {
        if (value === -1) {
          if (treeIndeterminates.indexOf(row) === -1) {
            treeIndeterminates.push(row);
          }

          _xeUtils.default.remove(selection, function (item) {
            return item === row;
          });
        } else {
          // 更新子节点状态
          _xeUtils.default.eachTree([row], function (item) {
            if (row === item || !checkMethod || checkMethod({
              row: item
            })) {
              if (value) {
                selection.push(item);
              } else {
                _xeUtils.default.remove(selection, function (select) {
                  return select === item;
                });
              }

              _xeUtils.default.remove(treeIndeterminates, function (half) {
                return half === item;
              });

              _this31.handleCheckboxReserveRow(row, value);
            }
          }, treeOpts);
        } // 如果存在父节点，更新父节点状态


        var _matchObj = _xeUtils.default.findTree(afterFullData, function (item) {
          return item === row;
        }, treeOpts);

        if (_matchObj && _matchObj.parent) {
          var _parentStatus;

          var _vItems = checkMethod ? _matchObj.items.filter(function (item) {
            return checkMethod({
              row: item
            });
          }) : _matchObj.items;

          var _indeterminatesItem = _xeUtils.default.find(_matchObj.items, function (item) {
            return treeIndeterminates.indexOf(item) > -1;
          });

          if (_indeterminatesItem) {
            _parentStatus = -1;
          } else {
            var _selectItems = _matchObj.items.filter(function (item) {
              return selection.indexOf(item) > -1;
            });

            _parentStatus = _selectItems.filter(function (item) {
              return _vItems.indexOf(item) > -1;
            }).length === _vItems.length ? true : _selectItems.length || value === -1 ? -1 : false;
          }

          return this.handleSelectRow({
            row: _matchObj.parent
          }, _parentStatus);
        }
      } else {
        if (!checkMethod || checkMethod({
          row: row
        })) {
          if (value) {
            if (selection.indexOf(row) === -1) {
              selection.push(row);
            }
          } else {
            _xeUtils.default.remove(selection, function (item) {
              return item === row;
            });
          }

          this.handleCheckboxReserveRow(row, value);
        }
      }
    }

    this.checkSelectionStatus();
  },
  handleToggleCheckRowEvent: function handleToggleCheckRowEvent(evnt, params) {
    var selection = this.selection,
        checkboxOpts = this.checkboxOpts;
    var property = checkboxOpts.checkField;
    var row = params.row;
    var value = property ? !_xeUtils.default.get(row, property) : selection.indexOf(row) === -1;

    if (evnt) {
      this.triggerCheckRowEvent(evnt, params, value);
    } else {
      this.handleSelectRow(params, value);
    }
  },
  triggerCheckRowEvent: function triggerCheckRowEvent(evnt, params, value) {
    var checkMethod = this.checkboxOpts.checkMethod;

    if (!checkMethod || checkMethod({
      row: params.row
    })) {
      this.handleSelectRow(params, value);
      this.emitEvent('checkbox-change', Object.assign({
        records: this.getCheckboxRecords(),
        reserves: this.getCheckboxReserveRecords(),
        indeterminates: this.getCheckboxIndeterminateRecords(),
        checked: value
      }, params), evnt);
    }
  },

  /**
   * 多选，切换某一行的选中状态
   */
  toggleCheckboxRow: function toggleCheckboxRow(row) {
    this.handleToggleCheckRowEvent(null, {
      row: row
    });
    return this.$nextTick();
  },

  /**
   * 用于多选行，设置所有行的选中状态
   * @param {Boolean} value 是否选中
   */
  setAllCheckboxRow: function setAllCheckboxRow(value) {
    var _this32 = this;

    var afterFullData = this.afterFullData,
        treeConfig = this.treeConfig,
        treeOpts = this.treeOpts,
        selection = this.selection,
        checkboxReserveRowMap = this.checkboxReserveRowMap,
        checkboxOpts = this.checkboxOpts;
    var property = checkboxOpts.checkField,
        reserve = checkboxOpts.reserve,
        checkStrictly = checkboxOpts.checkStrictly,
        checkMethod = checkboxOpts.checkMethod;
    var selectRows = [];
    var beforeSelection = treeConfig ? [] : selection.filter(function (row) {
      return afterFullData.indexOf(row) === -1;
    });

    if (checkStrictly) {
      this.isAllSelected = value;
    } else {
      /**
       * 绑定属性方式（高性能，有污染）
       * 必须在行数据存在对应的属性，否则将不响应
       */
      if (property) {
        var checkValFn = function checkValFn(row) {
          if (!checkMethod || checkMethod({
            row: row
          })) {
            if (value) {
              selectRows.push(row);
            }

            _xeUtils.default.set(row, property, value);
          }
        }; // 如果存在选中方法
        // 如果方法成立，则更新值，否则忽略该数据


        if (treeConfig) {
          _xeUtils.default.eachTree(afterFullData, checkValFn, treeOpts);
        } else {
          afterFullData.forEach(checkValFn);
        }
      } else {
        /**
         * 默认方式（低性能，无污染）
         * 无需任何属性，直接绑定
         */
        if (treeConfig) {
          if (value) {
            /**
             * 如果是树勾选
             * 如果方法成立，则添加到临时集合中
             */
            _xeUtils.default.eachTree(afterFullData, function (row) {
              if (!checkMethod || checkMethod({
                row: row
              })) {
                selectRows.push(row);
              }
            }, treeOpts);
          } else {
            /**
             * 如果是树取消
             * 如果方法成立，则不添加到临时集合中
             */
            if (checkMethod) {
              _xeUtils.default.eachTree(afterFullData, function (row) {
                if (checkMethod({
                  row: row
                }) ? 0 : selection.indexOf(row) > -1) {
                  selectRows.push(row);
                }
              }, treeOpts);
            }
          }
        } else {
          if (value) {
            /**
             * 如果是行勾选
             * 如果存在选中方法且成立或者本身已勾选，则添加到临时集合中
             * 如果不存在选中方法，则添加所有数据到临时集合中
             */
            if (checkMethod) {
              selectRows = afterFullData.filter(function (row) {
                return selection.indexOf(row) > -1 || checkMethod({
                  row: row
                });
              });
            } else {
              selectRows = afterFullData.slice(0);
            }
          } else {
            /**
             * 如果是行取消
             * 如果方法成立，则不添加到临时集合中；如果方法不成立则判断当前是否已勾选，如果已被勾选则添加到新集合中
             * 如果不存在选中方法，无需处理，临时集合默认为空
             */
            if (checkMethod) {
              selectRows = afterFullData.filter(function (row) {
                return checkMethod({
                  row: row
                }) ? 0 : selection.indexOf(row) > -1;
              });
            }
          }
        }
      }

      if (reserve) {
        if (value) {
          selectRows.forEach(function (row) {
            checkboxReserveRowMap[(0, _util.getRowid)(_this32, row)] = row;
          });
        } else {
          afterFullData.forEach(function (row) {
            return _this32.handleCheckboxReserveRow(row, false);
          });
        }
      }

      this.selection = property ? [] : beforeSelection.concat(selectRows);
    }

    this.treeIndeterminates = [];
    this.checkSelectionStatus();
  },
  checkSelectionStatus: function checkSelectionStatus() {
    var afterFullData = this.afterFullData,
        selection = this.selection,
        treeIndeterminates = this.treeIndeterminates,
        checkboxOpts = this.checkboxOpts,
        treeConfig = this.treeConfig;
    var checkField = checkboxOpts.checkField,
        halfField = checkboxOpts.halfField,
        checkStrictly = checkboxOpts.checkStrictly,
        checkMethod = checkboxOpts.checkMethod;

    if (!checkStrictly) {
      var disableRows = [];
      var checkRows = [];
      var isAllResolve = false;
      var isAllSelected = false;
      var isIndeterminate = false;

      if (checkField) {
        isAllResolve = afterFullData.every(checkMethod ? function (row) {
          if (!checkMethod({
            row: row
          })) {
            disableRows.push(row);
            return true;
          }

          if (_xeUtils.default.get(row, checkField)) {
            checkRows.push(row);
            return true;
          }

          return false;
        } : function (row) {
          return _xeUtils.default.get(row, checkField);
        });
        isAllSelected = isAllResolve && afterFullData.length !== disableRows.length;

        if (treeConfig) {
          if (halfField) {
            isIndeterminate = !isAllSelected && afterFullData.some(function (row) {
              return _xeUtils.default.get(row, checkField) || _xeUtils.default.get(row, halfField) || treeIndeterminates.indexOf(row) > -1;
            });
          } else {
            isIndeterminate = !isAllSelected && afterFullData.some(function (row) {
              return _xeUtils.default.get(row, checkField) || treeIndeterminates.indexOf(row) > -1;
            });
          }
        } else {
          if (halfField) {
            isIndeterminate = !isAllSelected && afterFullData.some(function (row) {
              return _xeUtils.default.get(row, checkField) || _xeUtils.default.get(row, halfField);
            });
          } else {
            isIndeterminate = !isAllSelected && afterFullData.some(function (row) {
              return _xeUtils.default.get(row, checkField);
            });
          }
        }
      } else {
        isAllResolve = afterFullData.every(checkMethod ? function (row) {
          if (!checkMethod({
            row: row
          })) {
            disableRows.push(row);
            return true;
          }

          if (selection.indexOf(row) > -1) {
            checkRows.push(row);
            return true;
          }

          return false;
        } : function (row) {
          return selection.indexOf(row) > -1;
        });
        isAllSelected = isAllResolve && afterFullData.length !== disableRows.length;

        if (treeConfig) {
          isIndeterminate = !isAllSelected && afterFullData.some(function (row) {
            return treeIndeterminates.indexOf(row) > -1 || selection.indexOf(row) > -1;
          });
        } else {
          isIndeterminate = !isAllSelected && afterFullData.some(function (row) {
            return selection.indexOf(row) > -1;
          });
        }
      }

      this.isAllSelected = isAllSelected;
      this.isIndeterminate = isIndeterminate;
    }
  },
  // 还原展开、选中等相关状态
  handleReserveStatus: function handleReserveStatus() {
    var expandColumn = this.expandColumn,
        treeOpts = this.treeOpts,
        treeConfig = this.treeConfig,
        fullDataRowIdData = this.fullDataRowIdData,
        fullAllDataRowMap = this.fullAllDataRowMap,
        currentRow = this.currentRow,
        selectRow = this.selectRow,
        radioReserveRow = this.radioReserveRow,
        radioOpts = this.radioOpts,
        checkboxOpts = this.checkboxOpts,
        selection = this.selection,
        rowExpandeds = this.rowExpandeds,
        treeExpandeds = this.treeExpandeds,
        expandOpts = this.expandOpts; // 单选框

    if (selectRow && !fullAllDataRowMap.has(selectRow)) {
      this.selectRow = null; // 刷新单选行状态
    } // 还原保留选中状态


    if (radioOpts.reserve && radioReserveRow) {
      var rowid = (0, _util.getRowid)(this, radioReserveRow);

      if (fullDataRowIdData[rowid]) {
        this.setRadioRow(fullDataRowIdData[rowid].row);
      }
    } // 复选框


    this.selection = getRecoverRow(this, selection); // 刷新多选行状态
    // 还原保留选中状态

    if (checkboxOpts.reserve) {
      this.setCheckboxRow(handleReserveRow(this, this.checkboxReserveRowMap), true);
    }

    if (currentRow && !fullAllDataRowMap.has(currentRow)) {
      this.currentRow = null; // 刷新当前行状态
    } // 行展开


    this.rowExpandeds = expandColumn ? getRecoverRow(this, rowExpandeds) : []; // 刷新行展开状态
    // 还原保留状态

    if (expandColumn && expandOpts.reserve) {
      this.setRowExpand(handleReserveRow(this, this.rowExpandedReserveRowMap), true);
    } // 树展开


    this.treeExpandeds = treeConfig ? getRecoverRow(this, treeExpandeds) : []; // 刷新树展开状态

    if (treeConfig && treeOpts.reserve) {
      this.setTreeExpand(handleReserveRow(this, this.treeExpandedReserveRowMap), true);
    }
  },

  /**
   * 获取单选框保留选中的行
   */
  getRadioReserveRecord: function getRadioReserveRecord(isFull) {
    var fullDataRowIdData = this.fullDataRowIdData,
        radioReserveRow = this.radioReserveRow,
        radioOpts = this.radioOpts,
        afterFullData = this.afterFullData,
        treeConfig = this.treeConfig,
        treeOpts = this.treeOpts;

    if (radioOpts.reserve && radioReserveRow) {
      var rowid = (0, _util.getRowid)(this, radioReserveRow);

      if (isFull) {
        if (!fullDataRowIdData[rowid]) {
          return radioReserveRow;
        }
      } else {
        var rowkey = (0, _util.getRowkey)(this);

        if (treeConfig) {
          var matchObj = _xeUtils.default.findTree(afterFullData, function (row) {
            return rowid === _xeUtils.default.get(row, rowkey);
          }, treeOpts);

          if (matchObj) {
            return radioReserveRow;
          }
        } else {
          if (!afterFullData.some(function (row) {
            return rowid === _xeUtils.default.get(row, rowkey);
          })) {
            return radioReserveRow;
          }
        }
      }
    }

    return null;
  },
  clearRadioReserve: function clearRadioReserve() {
    this.radioReserveRow = null;
    return this.$nextTick();
  },
  handleRadioReserveRow: function handleRadioReserveRow(row) {
    var radioOpts = this.radioOpts;

    if (radioOpts.reserve) {
      this.radioReserveRow = row;
    }
  },

  /**
   * 获取复选框保留选中的行
   */
  getCheckboxReserveRecords: function getCheckboxReserveRecords(isFull) {
    var _this33 = this;

    var fullDataRowIdData = this.fullDataRowIdData,
        afterFullData = this.afterFullData,
        checkboxReserveRowMap = this.checkboxReserveRowMap,
        checkboxOpts = this.checkboxOpts,
        treeConfig = this.treeConfig,
        treeOpts = this.treeOpts;
    var reserveSelection = [];

    if (checkboxOpts.reserve) {
      var afterFullIdMaps = {};

      if (treeConfig) {
        _xeUtils.default.eachTree(afterFullData, function (row) {
          afterFullIdMaps[(0, _util.getRowid)(_this33, row)] = 1;
        }, treeOpts);
      } else {
        afterFullData.forEach(function (row) {
          afterFullIdMaps[(0, _util.getRowid)(_this33, row)] = 1;
        });
      }

      _xeUtils.default.each(checkboxReserveRowMap, function (oldRow, oldRowid) {
        if (oldRow) {
          if (isFull) {
            if (!fullDataRowIdData[oldRowid]) {
              reserveSelection.push(oldRow);
            }
          } else {
            if (!afterFullIdMaps[oldRowid]) {
              reserveSelection.push(oldRow);
            }
          }
        }
      });
    }

    return reserveSelection;
  },
  clearCheckboxReserve: function clearCheckboxReserve() {
    this.checkboxReserveRowMap = {};
    return this.$nextTick();
  },
  handleCheckboxReserveRow: function handleCheckboxReserveRow(row, checked) {
    var checkboxReserveRowMap = this.checkboxReserveRowMap,
        checkboxOpts = this.checkboxOpts;

    if (checkboxOpts.reserve) {
      var rowid = (0, _util.getRowid)(this, row);

      if (checked) {
        checkboxReserveRowMap[rowid] = row;
      } else if (checkboxReserveRowMap[rowid]) {
        delete checkboxReserveRowMap[rowid];
      }
    }
  },

  /**
   * 多选，选中所有事件
   */
  triggerCheckAllEvent: function triggerCheckAllEvent(evnt, value) {
    this.setAllCheckboxRow(value);
    this.emitEvent('checkbox-all', {
      records: this.getCheckboxRecords(),
      reserves: this.getCheckboxReserveRecords(),
      indeterminates: this.getCheckboxIndeterminateRecords(),
      checked: value
    }, evnt);
  },

  /**
   * 多选，切换所有行的选中状态
   */
  toggleAllCheckboxRow: function toggleAllCheckboxRow() {
    this.triggerCheckAllEvent(null, !this.isAllSelected);
    return this.$nextTick();
  },

  /**
   * 用于多选行，手动清空用户的选择
   * 清空行为不管是否被禁用还是保留记录，都将彻底清空选中状态
   */
  clearCheckboxRow: function clearCheckboxRow() {
    var _this34 = this;

    var tableFullData = this.tableFullData,
        treeConfig = this.treeConfig,
        treeOpts = this.treeOpts,
        checkboxOpts = this.checkboxOpts;
    var property = checkboxOpts.checkField,
        reserve = checkboxOpts.reserve;

    if (property) {
      if (treeConfig) {
        _xeUtils.default.eachTree(tableFullData, function (item) {
          return _xeUtils.default.set(item, property, false);
        }, treeOpts);
      } else {
        tableFullData.forEach(function (item) {
          return _xeUtils.default.set(item, property, false);
        });
      }
    }

    if (reserve) {
      tableFullData.forEach(function (row) {
        return _this34.handleCheckboxReserveRow(row, false);
      });
    }

    this.isAllSelected = false;
    this.isIndeterminate = false;
    this.selection = [];
    this.treeIndeterminates = [];
    return this.$nextTick();
  },

  /**
   * 处理单选框默认勾选
   */
  handleDefaultRadioChecked: function handleDefaultRadioChecked() {
    var radioOpts = this.radioOpts,
        fullDataRowIdData = this.fullDataRowIdData;
    var rowid = radioOpts.checkRowKey,
        reserve = radioOpts.reserve;

    if (rowid) {
      if (fullDataRowIdData[rowid]) {
        this.setRadioRow(fullDataRowIdData[rowid].row);
      }

      if (reserve) {
        var rowkey = (0, _util.getRowkey)(this);
        this.radioReserveRow = _defineProperty({}, rowkey, rowid);
      }
    }
  },

  /**
   * 单选，行选中事件
   */
  triggerRadioRowEvent: function triggerRadioRowEvent(evnt, params) {
    var oldValue = this.selectRow,
        radioOpts = this.radioOpts;
    var row = params.row;
    var newValue = row;
    var isChange = oldValue !== newValue;

    if (isChange) {
      this.setRadioRow(newValue);
    } else if (!radioOpts.strict) {
      isChange = oldValue === newValue;

      if (isChange) {
        newValue = null;
        this.clearRadioRow();
      }
    }

    if (isChange) {
      this.emitEvent('radio-change', _objectSpread({
        oldValue: oldValue,
        newValue: newValue
      }, params), evnt);
    }
  },
  triggerCurrentRowEvent: function triggerCurrentRowEvent(evnt, params) {
    var oldValue = this.currentRow;
    var newValue = params.row;
    var isChange = oldValue !== newValue;
    this.setCurrentRow(newValue);

    if (isChange) {
      this.emitEvent('current-change', _objectSpread({
        oldValue: oldValue,
        newValue: newValue
      }, params), evnt);
    }
  },

  /**
   * 用于当前行，设置某一行为高亮状态
   * @param {Row} row 行对象
   */
  setCurrentRow: function setCurrentRow(row) {
    var $el = this.$el,
        rowOpts = this.rowOpts;
    this.clearCurrentRow();
    this.clearCurrentColumn();
    this.currentRow = row;

    if (rowOpts.isCurrent || this.highlightCurrentRow) {
      if ($el) {
        _xeUtils.default.arrayEach($el.querySelectorAll("[rowid=\"".concat((0, _util.getRowid)(this, row), "\"]")), function (elem) {
          return addClass(elem, 'row--current');
        });
      }
    }

    return this.$nextTick();
  },
  isCheckedByRadioRow: function isCheckedByRadioRow(row) {
    return this.selectRow === row;
  },

  /**
   * 用于单选行，设置某一行为选中状态
   * @param {Row} row 行对象
   */
  setRadioRow: function setRadioRow(row) {
    var radioOpts = this.radioOpts;
    var checkMethod = radioOpts.checkMethod;

    if (row && (!checkMethod || checkMethod({
      row: row
    }))) {
      this.selectRow = row;
      this.handleRadioReserveRow(row);
    }

    return this.$nextTick();
  },

  /**
   * 用于当前行，手动清空当前高亮的状态
   */
  clearCurrentRow: function clearCurrentRow() {
    var $el = this.$el;
    this.currentRow = null;
    this.hoverRow = null;

    if ($el) {
      _xeUtils.default.arrayEach($el.querySelectorAll('.row--current'), function (elem) {
        return removeClass(elem, 'row--current');
      });
    }

    return this.$nextTick();
  },

  /**
   * 用于单选行，手动清空用户的选择
   */
  clearRadioRow: function clearRadioRow() {
    this.selectRow = null;
    return this.$nextTick();
  },

  /**
   * 用于当前行，获取当前行的数据
   */
  getCurrentRecord: function getCurrentRecord() {
    return this.rowOpts.isCurrent || this.highlightCurrentRow ? this.currentRow : null;
  },

  /**
   * 用于单选行，获取当已选中的数据
   */
  getRadioRecord: function getRadioRecord(isFull) {
    var treeConfig = this.treeConfig,
        treeOpts = this.treeOpts,
        selectRow = this.selectRow,
        fullDataRowIdData = this.fullDataRowIdData,
        afterFullData = this.afterFullData;

    if (selectRow) {
      var rowid = (0, _util.getRowid)(this, selectRow);

      if (isFull) {
        if (!fullDataRowIdData[rowid]) {
          return selectRow;
        }
      } else {
        if (treeConfig) {
          var rowkey = (0, _util.getRowkey)(this);

          var matchObj = _xeUtils.default.findTree(afterFullData, function (row) {
            return rowid === _xeUtils.default.get(row, rowkey);
          }, treeOpts);

          if (matchObj) {
            return selectRow;
          }
        } else {
          if (afterFullData.indexOf(selectRow) > -1) {
            return selectRow;
          }
        }
      }
    }

    return null;
  },

  /**
   * 行 hover 事件
   */
  triggerHoverEvent: function triggerHoverEvent(evnt, _ref7) {
    var row = _ref7.row;
    this.setHoverRow(row);
  },
  setHoverRow: function setHoverRow(row) {
    var $el = this.$el;
    var rowid = (0, _util.getRowid)(this, row);
    this.clearHoverRow();

    if ($el) {
      _xeUtils.default.arrayEach($el.querySelectorAll("[rowid=\"".concat(rowid, "\"]")), function (elem) {
        return addClass(elem, 'row--hover');
      });
    }

    this.hoverRow = row;
  },
  clearHoverRow: function clearHoverRow() {
    var $el = this.$el;

    if ($el) {
      _xeUtils.default.arrayEach($el.querySelectorAll('.vxe-body--row.row--hover'), function (elem) {
        return removeClass(elem, 'row--hover');
      });
    }

    this.hoverRow = null;
  },
  triggerHeaderCellClickEvent: function triggerHeaderCellClickEvent(evnt, params) {
    var _lastResizeTime = this._lastResizeTime,
        sortOpts = this.sortOpts;
    var column = params.column;
    var cell = evnt.currentTarget;

    var triggerResizable = _lastResizeTime && _lastResizeTime > Date.now() - 300;

    var triggerSort = getEventTargetNode(evnt, cell, 'vxe-cell--sort').flag;
    var triggerFilter = getEventTargetNode(evnt, cell, 'vxe-cell--filter').flag;

    if (sortOpts.trigger === 'cell' && !(triggerResizable || triggerSort || triggerFilter)) {
      this.triggerSortEvent(evnt, column, getNextSortOrder(this, column));
    }

    this.emitEvent('header-cell-click', Object.assign({
      triggerResizable: triggerResizable,
      triggerSort: triggerSort,
      triggerFilter: triggerFilter,
      cell: cell
    }, params), evnt);

    if (this.columnOpts.isCurrent || this.highlightCurrentColumn) {
      return this.setCurrentColumn(column);
    }

    return this.$nextTick();
  },
  triggerHeaderCellDblclickEvent: function triggerHeaderCellDblclickEvent(evnt, params) {
    this.emitEvent('header-cell-dblclick', Object.assign({
      cell: evnt.currentTarget
    }, params), evnt);
  },
  getCurrentColumn: function getCurrentColumn() {
    return this.columnOpts.isCurrent || this.highlightCurrentColumn ? this.currentColumn : null;
  },

  /**
   * 用于当前列，设置某列行为高亮状态
   * @param {ColumnInfo} fieldOrColumn 列配置
   */
  setCurrentColumn: function setCurrentColumn(fieldOrColumn) {
    var column = (0, _util.handleFieldOrColumn)(this, fieldOrColumn);

    if (column) {
      this.clearCurrentRow();
      this.clearCurrentColumn();
      this.currentColumn = column;
    }

    return this.$nextTick();
  },

  /**
   * 用于当前列，手动清空当前高亮的状态
   */
  clearCurrentColumn: function clearCurrentColumn() {
    this.currentColumn = null;
    return this.$nextTick();
  },
  checkValidate: function checkValidate(type) {
    if (_vXETable.default._valid) {
      return this.triggerValidate(type);
    }

    return this.$nextTick();
  },

  /**
   * 当单元格发生改变时
   * 如果存在规则，则校验
   */
  handleChangeCell: function handleChangeCell(evnt, params) {
    var _this35 = this;

    this.checkValidate('blur').catch(function (e) {
      return e;
    }).then(function () {
      _this35.handleActived(params, evnt).then(function () {
        return _this35.checkValidate('change');
      }).catch(function (e) {
        return e;
      });
    });
  },

  /**
   * 列点击事件
   * 如果是单击模式，则激活为编辑状态
   * 如果是双击模式，则单击后选中状态
   */
  triggerCellClickEvent: function triggerCellClickEvent(evnt, params) {
    var highlightCurrentRow = this.highlightCurrentRow,
        editStore = this.editStore,
        radioOpts = this.radioOpts,
        expandOpts = this.expandOpts,
        treeOpts = this.treeOpts,
        editConfig = this.editConfig,
        editOpts = this.editOpts,
        checkboxOpts = this.checkboxOpts,
        rowOpts = this.rowOpts;
    var actived = editStore.actived;
    var _params = params,
        row = _params.row,
        column = _params.column;
    var type = column.type,
        treeNode = column.treeNode;
    var isRadioType = type === 'radio';
    var isCheckboxType = type === 'checkbox';
    var isExpandType = type === 'expand';
    var cell = evnt.currentTarget;
    var triggerRadio = isRadioType && getEventTargetNode(evnt, cell, 'vxe-cell--radio').flag;
    var triggerCheckbox = isCheckboxType && getEventTargetNode(evnt, cell, 'vxe-cell--checkbox').flag;
    var triggerTreeNode = treeNode && getEventTargetNode(evnt, cell, 'vxe-tree--btn-wrapper').flag;
    var triggerExpandNode = isExpandType && getEventTargetNode(evnt, cell, 'vxe-table--expanded').flag;
    params = Object.assign({
      cell: cell,
      triggerRadio: triggerRadio,
      triggerCheckbox: triggerCheckbox,
      triggerTreeNode: triggerTreeNode,
      triggerExpandNode: triggerExpandNode
    }, params);

    if (!triggerCheckbox && !triggerRadio) {
      // 如果是展开行
      if (!triggerExpandNode && (expandOpts.trigger === 'row' || isExpandType && expandOpts.trigger === 'cell')) {
        this.triggerRowExpandEvent(evnt, params);
      } // 如果是树形表格


      if (treeOpts.trigger === 'row' || treeNode && treeOpts.trigger === 'cell') {
        this.triggerTreeExpandEvent(evnt, params);
      }
    } // 如果点击了树节点


    if (!triggerTreeNode) {
      if (!triggerExpandNode) {
        // 如果是高亮行
        if (rowOpts.isCurrent || highlightCurrentRow) {
          if (!triggerCheckbox && !triggerRadio) {
            this.triggerCurrentRowEvent(evnt, params);
          }
        } // 如果是单选框


        if (!triggerRadio && (radioOpts.trigger === 'row' || isRadioType && radioOpts.trigger === 'cell')) {
          this.triggerRadioRowEvent(evnt, params);
        } // 如果是复选框


        if (!triggerCheckbox && (checkboxOpts.trigger === 'row' || isCheckboxType && checkboxOpts.trigger === 'cell')) {
          this.handleToggleCheckRowEvent(evnt, params);
        }
      } // 如果设置了单元格选中功能，则不会使用点击事件去处理（只能支持双击模式）


      if ((0, _utils.isEnableConf)(editConfig)) {
        if (editOpts.trigger === 'manual') {
          if (actived.args && actived.row === row && column !== actived.column) {
            this.handleChangeCell(evnt, params);
          }
        } else if (!actived.args || row !== actived.row || column !== actived.column) {
          if (editOpts.trigger === 'click') {
            this.handleChangeCell(evnt, params);
          } else if (editOpts.trigger === 'dblclick') {
            if (editOpts.mode === 'row' && actived.row === row) {
              this.handleChangeCell(evnt, params);
            }
          }
        }
      }
    }

    this.emitEvent('cell-click', params, evnt);
  },

  /**
   * 列双击点击事件
   * 如果是双击模式，则激活为编辑状态
   */
  triggerCellDblclickEvent: function triggerCellDblclickEvent(evnt, params) {
    var _this36 = this;

    var editStore = this.editStore,
        editConfig = this.editConfig,
        editOpts = this.editOpts;
    var actived = editStore.actived;
    var cell = evnt.currentTarget;
    params.cell = cell;

    if ((0, _utils.isEnableConf)(editConfig) && editOpts.trigger === 'dblclick') {
      if (!actived.args || evnt.currentTarget !== actived.args.cell) {
        if (editOpts.mode === 'row') {
          this.checkValidate('blur').catch(function (e) {
            return e;
          }).then(function () {
            _this36.handleActived(params, evnt).then(function () {
              return _this36.checkValidate('change');
            }).catch(function (e) {
              return e;
            });
          });
        } else if (editOpts.mode === 'cell') {
          this.handleActived(params, evnt).then(function () {
            return _this36.checkValidate('change');
          }).catch(function (e) {
            return e;
          });
        }
      }
    }

    this.emitEvent('cell-dblclick', params, evnt);
  },
  handleDefaultSort: function handleDefaultSort() {
    var _this37 = this;

    var sortConfig = this.sortConfig,
        sortOpts = this.sortOpts;
    var defaultSort = sortOpts.defaultSort;

    if (defaultSort) {
      if (!_xeUtils.default.isArray(defaultSort)) {
        defaultSort = [defaultSort];
      }

      if (defaultSort.length) {
        (sortConfig.multiple ? defaultSort : defaultSort.slice(0, 1)).forEach(function (item, index) {
          var field = item.field,
              order = item.order;

          if (field && order) {
            var column = _this37.getColumnByField(field);

            if (column && column.sortable) {
              column.order = order;
              column.sortTime = Date.now() + index;
            }
          }
        });

        if (!sortOpts.remote) {
          this.handleTableData(true).then(this.updateStyle);
        }
      }
    }
  },

  /**
   * 点击排序事件
   */
  triggerSortEvent: function triggerSortEvent(evnt, column, order) {
    var sortOpts = this.sortOpts;
    var property = column.property;

    if (column.sortable || column.remoteSort) {
      if (!order || column.order === order) {
        this.clearSort(sortOpts.multiple ? column : null);
      } else {
        this.sort({
          field: property,
          order: order
        });
      }

      var params = {
        column: column,
        property: property,
        order: column.order,
        sortList: this.getSortColumns()
      };
      this.emitEvent('sort-change', params, evnt);
    }
  },
  sort: function sort(sortConfs, sortOrder) {
    var _this38 = this;

    var sortOpts = this.sortOpts;
    var multiple = sortOpts.multiple,
        remote = sortOpts.remote,
        orders = sortOpts.orders;

    if (sortConfs) {
      if (_xeUtils.default.isString(sortConfs)) {
        sortConfs = [{
          field: sortConfs,
          order: sortOrder
        }];
      }
    }

    if (!_xeUtils.default.isArray(sortConfs)) {
      sortConfs = [sortConfs];
    }

    if (sortConfs.length) {
      var firstSortColumn;

      if (!multiple) {
        clearAllSort(this);
      }

      (multiple ? sortConfs : [sortConfs[0]]).forEach(function (confs, index) {
        var field = confs.field,
            order = confs.order;
        var column = field;

        if (_xeUtils.default.isString(field)) {
          column = _this38.getColumnByField(field);
        }

        if (column && (column.sortable || column.remoteSort)) {
          if (!firstSortColumn) {
            firstSortColumn = column;
          }

          if (orders.indexOf(order) === -1) {
            order = getNextSortOrder(_this38, column);
          }

          if (column.order !== order) {
            column.order = order;
          }

          column.sortTime = Date.now() + index;
        }
      }); // 如果是服务端排序，则跳过本地排序处理

      if (!remote || firstSortColumn && firstSortColumn.remoteSort) {
        this.handleTableData(true);
      }

      return this.$nextTick().then(this.updateStyle);
    }

    return this.$nextTick();
  },

  /**
   * 清空指定列的排序条件
   * 如果为空则清空所有列的排序条件
   * @param {String} column 列或字段名
   */
  clearSort: function clearSort(fieldOrColumn) {
    var sortOpts = this.sortOpts;

    if (fieldOrColumn) {
      var column = (0, _util.handleFieldOrColumn)(this, fieldOrColumn);

      if (column) {
        column.order = null;
      }
    } else {
      clearAllSort(this);
    }

    if (!sortOpts.remote) {
      this.handleTableData(true);
    }

    return this.$nextTick().then(this.updateStyle);
  },
  // 在 v3 中废弃
  getSortColumn: function getSortColumn() {
    if (process.env.NODE_ENV === 'development') {
      (0, _log.warnLog)('vxe.error.delFunc', ['getSortColumn', 'getSortColumns']);
    }

    return _xeUtils.default.find(this.tableFullColumn, function (column) {
      return (column.sortable || column.remoteSort) && column.order;
    });
  },
  isSort: function isSort(fieldOrColumn) {
    if (fieldOrColumn) {
      var column = (0, _util.handleFieldOrColumn)(this, fieldOrColumn);
      return column && column.sortable && !!column.order;
    }

    return this.getSortColumns().length > 0;
  },
  getSortColumns: function getSortColumns() {
    var _this$sortOpts = this.sortOpts,
        multiple = _this$sortOpts.multiple,
        chronological = _this$sortOpts.chronological;
    var sortList = [];
    this.tableFullColumn.forEach(function (column) {
      var property = column.property,
          order = column.order;

      if ((column.sortable || column.remoteSort) && order) {
        sortList.push({
          column: column,
          field: column.property,
          property: property,
          order: order,
          sortTime: column.sortTime
        });
      }
    });

    if (multiple && chronological && sortList.length > 1) {
      return _xeUtils.default.orderBy(sortList, 'sortTime');
    }

    return sortList;
  },

  /**
   * 关闭筛选
   * @param {Event} evnt 事件
   */
  closeFilter: function closeFilter() {
    var filterStore = this.filterStore;
    var column = filterStore.column,
        visible = filterStore.visible;
    Object.assign(filterStore, {
      isAllSelected: false,
      isIndeterminate: false,
      options: [],
      visible: false
    });

    if (visible) {
      this.emitEvent('filter-visible', {
        column: column,
        property: column.property,
        filterList: this.getCheckedFilters(),
        visible: false
      }, null);
    }

    return this.$nextTick();
  },

  /**
   * 判断指定列是否为筛选状态，如果为空则判断所有列
   * @param {String} fieldOrColumn 字段名
   */
  isFilter: function isFilter(fieldOrColumn) {
    var column = (0, _util.handleFieldOrColumn)(this, fieldOrColumn);

    if (column) {
      return column.filters && column.filters.some(function (option) {
        return option.checked;
      });
    }

    return this.getCheckedFilters().length > 0;
  },

  /**
   * 判断展开行是否懒加载完成
   * @param {Row} row 行对象
   */
  isRowExpandLoaded: function isRowExpandLoaded(row) {
    var rest = this.fullAllDataRowMap.get(row);
    return rest && rest.expandLoaded;
  },
  clearRowExpandLoaded: function clearRowExpandLoaded(row) {
    var expandOpts = this.expandOpts,
        expandLazyLoadeds = this.expandLazyLoadeds,
        fullAllDataRowMap = this.fullAllDataRowMap;
    var lazy = expandOpts.lazy;
    var rest = fullAllDataRowMap.get(row);

    if (lazy && rest) {
      rest.expandLoaded = false;

      _xeUtils.default.remove(expandLazyLoadeds, function (item) {
        return row === item;
      });
    }

    return this.$nextTick();
  },

  /**
   * 重新懒加载展开行，并展开内容
   * @param {Row} row 行对象
   */
  reloadRowExpand: function reloadRowExpand(row) {
    var _this39 = this;

    var expandOpts = this.expandOpts,
        expandLazyLoadeds = this.expandLazyLoadeds;
    var lazy = expandOpts.lazy;

    if (lazy && expandLazyLoadeds.indexOf(row) === -1) {
      this.clearRowExpandLoaded(row).then(function () {
        return _this39.handleAsyncRowExpand(row);
      });
    }

    return this.$nextTick();
  },
  reloadExpandContent: function reloadExpandContent(row) {
    if (process.env.NODE_ENV === 'development') {
      (0, _log.warnLog)('vxe.error.delFunc', ['reloadExpandContent', 'reloadRowExpand']);
    } // 即将废弃


    return this.reloadRowExpand(row);
  },

  /**
   * 展开行事件
   */
  triggerRowExpandEvent: function triggerRowExpandEvent(evnt, params) {
    var expandOpts = this.expandOpts,
        expandLazyLoadeds = this.expandLazyLoadeds,
        column = this.expandColumn;
    var row = params.row;
    var lazy = expandOpts.lazy;

    if (!lazy || expandLazyLoadeds.indexOf(row) === -1) {
      var expanded = !this.isExpandByRow(row);
      var columnIndex = this.getColumnIndex(column);
      var $columnIndex = this.getVMColumnIndex(column);
      this.setRowExpand(row, expanded);
      this.emitEvent('toggle-row-expand', {
        expanded: expanded,
        column: column,
        columnIndex: columnIndex,
        $columnIndex: $columnIndex,
        row: row,
        rowIndex: this.getRowIndex(row),
        $rowIndex: this.getVMRowIndex(row)
      }, evnt);
    }
  },

  /**
   * 切换展开行
   */
  toggleRowExpand: function toggleRowExpand(row) {
    return this.setRowExpand(row, !this.isExpandByRow(row));
  },

  /**
   * 处理默认展开行
   */
  handleDefaultRowExpand: function handleDefaultRowExpand() {
    var expandOpts = this.expandOpts,
        fullDataRowIdData = this.fullDataRowIdData;
    var expandAll = expandOpts.expandAll,
        expandRowKeys = expandOpts.expandRowKeys;

    if (expandAll) {
      this.setAllRowExpand(true);
    } else if (expandRowKeys) {
      var defExpandeds = [];
      expandRowKeys.forEach(function (rowid) {
        if (fullDataRowIdData[rowid]) {
          defExpandeds.push(fullDataRowIdData[rowid].row);
        }
      });
      this.setRowExpand(defExpandeds, true);
    }
  },

  /**
   * 设置所有行的展开与否
   * @param {Boolean} expanded 是否展开
   */
  setAllRowExpand: function setAllRowExpand(expanded) {
    return this.setRowExpand(this.expandOpts.lazy ? this.tableData : this.tableFullData, expanded);
  },
  handleAsyncRowExpand: function handleAsyncRowExpand(row) {
    var _this40 = this;

    var rest = this.fullAllDataRowMap.get(row);
    return new Promise(function (resolve) {
      _this40.expandLazyLoadeds.push(row);

      _this40.expandOpts.loadMethod({
        $table: _this40,
        row: row,
        rowIndex: _this40.getRowIndex(row),
        $rowIndex: _this40.getVMRowIndex(row)
      }).catch(function (e) {
        return e;
      }).then(function () {
        rest.expandLoaded = true;

        _xeUtils.default.remove(_this40.expandLazyLoadeds, function (item) {
          return item === row;
        });

        _this40.rowExpandeds.push(row);

        resolve(_this40.$nextTick().then(_this40.recalculate));
      });
    });
  },

  /**
   * 设置展开行，二个参数设置这一行展开与否
   * 支持单行
   * 支持多行
   * @param {Array/Row} rows 行数据
   * @param {Boolean} expanded 是否展开
   */
  setRowExpand: function setRowExpand(rows, expanded) {
    var _this41 = this;

    var fullAllDataRowMap = this.fullAllDataRowMap,
        expandLazyLoadeds = this.expandLazyLoadeds,
        expandOpts = this.expandOpts,
        column = this.expandColumn;
    var rowExpandeds = this.rowExpandeds;
    var reserve = expandOpts.reserve,
        lazy = expandOpts.lazy,
        accordion = expandOpts.accordion,
        toggleMethod = expandOpts.toggleMethod;
    var lazyRests = [];
    var columnIndex = this.getColumnIndex(column);
    var $columnIndex = this.getVMColumnIndex(column);

    if (rows) {
      if (!_xeUtils.default.isArray(rows)) {
        rows = [rows];
      }

      if (accordion) {
        // 只能同时展开一个
        rowExpandeds = [];
        rows = rows.slice(rows.length - 1, rows.length);
      }

      var validRows = toggleMethod ? rows.filter(function (row) {
        return toggleMethod({
          expanded: expanded,
          column: column,
          columnIndex: columnIndex,
          $columnIndex: $columnIndex,
          row: row,
          rowIndex: _this41.getRowIndex(row),
          $rowIndex: _this41.getVMRowIndex(row)
        });
      }) : rows;

      if (expanded) {
        validRows.forEach(function (row) {
          if (rowExpandeds.indexOf(row) === -1) {
            var rest = fullAllDataRowMap.get(row);
            var isLoad = lazy && !rest.expandLoaded && expandLazyLoadeds.indexOf(row) === -1;

            if (isLoad) {
              lazyRests.push(_this41.handleAsyncRowExpand(row));
            } else {
              rowExpandeds.push(row);
            }
          }
        });
      } else {
        _xeUtils.default.remove(rowExpandeds, function (row) {
          return validRows.indexOf(row) > -1;
        });
      }

      if (reserve) {
        validRows.forEach(function (row) {
          return _this41.handleRowExpandReserve(row, expanded);
        });
      }
    }

    this.rowExpandeds = rowExpandeds;
    return Promise.all(lazyRests).then(this.recalculate);
  },

  /**
   * 判断行是否为展开状态
   * @param {Row} row 行对象
   */
  isExpandByRow: function isExpandByRow(row) {
    return this.rowExpandeds.indexOf(row) > -1;
  },

  /**
   * 手动清空展开行状态，数据会恢复成未展开的状态
   */
  clearRowExpand: function clearRowExpand() {
    var _this42 = this;

    var expandOpts = this.expandOpts,
        rowExpandeds = this.rowExpandeds,
        tableFullData = this.tableFullData;
    var reserve = expandOpts.reserve;
    var isExists = rowExpandeds.length;
    this.rowExpandeds = [];

    if (reserve) {
      tableFullData.forEach(function (row) {
        return _this42.handleRowExpandReserve(row, false);
      });
    }

    return this.$nextTick().then(function () {
      if (isExists) {
        _this42.recalculate();
      }
    });
  },
  clearRowExpandReserve: function clearRowExpandReserve() {
    this.rowExpandedReserveRowMap = {};
    return this.$nextTick();
  },
  handleRowExpandReserve: function handleRowExpandReserve(row, expanded) {
    var rowExpandedReserveRowMap = this.rowExpandedReserveRowMap,
        expandOpts = this.expandOpts;

    if (expandOpts.reserve) {
      var rowid = (0, _util.getRowid)(this, row);

      if (expanded) {
        rowExpandedReserveRowMap[rowid] = row;
      } else if (rowExpandedReserveRowMap[rowid]) {
        delete rowExpandedReserveRowMap[rowid];
      }
    }
  },
  getRowExpandRecords: function getRowExpandRecords() {
    return this.rowExpandeds.slice(0);
  },
  getTreeExpandRecords: function getTreeExpandRecords() {
    return this.treeExpandeds.slice(0);
  },

  /**
   * 获取数表格状态
   */
  getTreeStatus: function getTreeStatus() {
    if (this.treeConfig) {
      return {
        config: this.treeOpts,
        rowExpandeds: this.getTreeExpandRecords()
      };
    }

    return null;
  },

  /**
   * 判断树节点是否懒加载完成
   * @param {Row} row 行对象
   */
  isTreeExpandLoaded: function isTreeExpandLoaded(row) {
    var rest = this.fullAllDataRowMap.get(row);
    return rest && rest.treeLoaded;
  },
  clearTreeExpandLoaded: function clearTreeExpandLoaded(row) {
    var treeOpts = this.treeOpts,
        treeExpandeds = this.treeExpandeds,
        fullAllDataRowMap = this.fullAllDataRowMap;
    var transform = treeOpts.transform,
        lazy = treeOpts.lazy;
    var rest = fullAllDataRowMap.get(row);

    if (lazy && rest) {
      rest.treeLoaded = false;

      _xeUtils.default.remove(treeExpandeds, function (item) {
        return row === item;
      });
    }

    if (transform) {
      this.handleVirtualTreeToList();
      return this.handleTableData();
    }

    return this.$nextTick();
  },

  /**
   * 重新懒加载树节点，并展开该节点
   * @param {Row} row 行对象
   */
  reloadTreeExpand: function reloadTreeExpand(row) {
    var _this43 = this;

    var treeOpts = this.treeOpts,
        treeLazyLoadeds = this.treeLazyLoadeds;
    var transform = treeOpts.transform,
        lazy = treeOpts.lazy,
        hasChild = treeOpts.hasChild;

    if (lazy && row[hasChild] && treeLazyLoadeds.indexOf(row) === -1) {
      this.clearTreeExpandLoaded(row).then(function () {
        return _this43.handleAsyncTreeExpandChilds(row);
      }).then(function () {
        if (transform) {
          _this43.handleVirtualTreeToList();

          return _this43.handleTableData();
        }
      }).then(function () {
        return _this43.recalculate();
      });
    }

    return this.$nextTick();
  },
  reloadTreeChilds: function reloadTreeChilds(row) {
    if (process.env.NODE_ENV === 'development') {
      (0, _log.warnLog)('vxe.error.delFunc', ['reloadTreeChilds', 'reloadTreeExpand']);
    } // 即将废弃


    return this.reloadTreeExpand(row);
  },

  /**
   * 展开树节点事件
   */
  triggerTreeExpandEvent: function triggerTreeExpandEvent(evnt, params) {
    var treeOpts = this.treeOpts,
        treeLazyLoadeds = this.treeLazyLoadeds;
    var row = params.row,
        column = params.column;
    var lazy = treeOpts.lazy;

    if (!lazy || treeLazyLoadeds.indexOf(row) === -1) {
      var expanded = !this.isTreeExpandByRow(row);
      var columnIndex = this.getColumnIndex(column);
      var $columnIndex = this.getVMColumnIndex(column);
      this.setTreeExpand(row, expanded);
      this.emitEvent('toggle-tree-expand', {
        expanded: expanded,
        column: column,
        columnIndex: columnIndex,
        $columnIndex: $columnIndex,
        row: row
      }, evnt);
    }
  },

  /**
   * 切换/展开树节点
   */
  toggleTreeExpand: function toggleTreeExpand(row) {
    return this.setTreeExpand(row, !this.isTreeExpandByRow(row));
  },

  /**
   * 处理默认展开树节点
   */
  handleDefaultTreeExpand: function handleDefaultTreeExpand() {
    var treeConfig = this.treeConfig,
        treeOpts = this.treeOpts,
        tableFullData = this.tableFullData;

    if (treeConfig) {
      var expandAll = treeOpts.expandAll,
          expandRowKeys = treeOpts.expandRowKeys;

      if (expandAll) {
        this.setAllTreeExpand(true);
      } else if (expandRowKeys) {
        var defExpandeds = [];
        var rowkey = (0, _util.getRowkey)(this);
        expandRowKeys.forEach(function (rowid) {
          var matchObj = _xeUtils.default.findTree(tableFullData, function (item) {
            return rowid === _xeUtils.default.get(item, rowkey);
          }, treeOpts);

          if (matchObj) {
            defExpandeds.push(matchObj.item);
          }
        });
        this.setTreeExpand(defExpandeds, true);
      }
    }
  },
  handleAsyncTreeExpandChilds: function handleAsyncTreeExpandChilds(row) {
    var _this44 = this;

    var fullAllDataRowMap = this.fullAllDataRowMap,
        treeExpandeds = this.treeExpandeds,
        treeOpts = this.treeOpts,
        treeLazyLoadeds = this.treeLazyLoadeds,
        checkboxOpts = this.checkboxOpts;
    var transform = treeOpts.transform,
        loadMethod = treeOpts.loadMethod;
    var checkStrictly = checkboxOpts.checkStrictly;
    var rest = fullAllDataRowMap.get(row);
    return new Promise(function (resolve) {
      treeLazyLoadeds.push(row);
      loadMethod({
        $table: _this44,
        row: row
      }).catch(function () {
        return [];
      }).then(function (childRecords) {
        rest.treeLoaded = true;

        _xeUtils.default.remove(treeLazyLoadeds, function (item) {
          return item === row;
        });

        if (!_xeUtils.default.isArray(childRecords)) {
          childRecords = [];
        }

        if (childRecords) {
          _this44.loadTreeChildren(row, childRecords).then(function (childRows) {
            if (childRows.length && treeExpandeds.indexOf(row) === -1) {
              treeExpandeds.push(row);
            } // 如果当前节点已选中，则展开后子节点也被选中


            if (!checkStrictly && _this44.isCheckedByCheckboxRow(row)) {
              _this44.setCheckboxRow(childRows, true);
            }

            _this44.$nextTick().then(function () {
              if (transform) {
                return _this44.handleTableData();
              }
            }).then(function () {
              return _this44.recalculate();
            }).then(function () {
              return resolve();
            });
          });
        } else {
          _this44.$nextTick().then(function () {
            return _this44.recalculate();
          }).then(function () {
            return resolve();
          });
        }
      });
    });
  },

  /**
   * 设置所有树节点的展开与否
   * @param {Boolean} expanded 是否展开
   */
  setAllTreeExpand: function setAllTreeExpand(expanded) {
    var tableFullData = this.tableFullData,
        treeOpts = this.treeOpts;
    var lazy = treeOpts.lazy,
        children = treeOpts.children;
    var expandeds = [];

    _xeUtils.default.eachTree(tableFullData, function (row) {
      var rowChildren = row[children];

      if (lazy || rowChildren && rowChildren.length) {
        expandeds.push(row);
      }
    }, treeOpts);

    return this.setTreeExpand(expandeds, expanded);
  },

  /**
   * 默认，展开与收起树节点
   * @param rows
   * @param expanded
   * @returns
   */
  handleBaseTreeExpand: function handleBaseTreeExpand(rows, expanded) {
    var _this45 = this;

    var fullAllDataRowMap = this.fullAllDataRowMap,
        tableFullData = this.tableFullData,
        treeExpandeds = this.treeExpandeds,
        treeOpts = this.treeOpts,
        treeLazyLoadeds = this.treeLazyLoadeds,
        treeNodeColumn = this.treeNodeColumn;
    var reserve = treeOpts.reserve,
        lazy = treeOpts.lazy,
        hasChild = treeOpts.hasChild,
        children = treeOpts.children,
        accordion = treeOpts.accordion,
        toggleMethod = treeOpts.toggleMethod;
    var result = [];
    var columnIndex = this.getColumnIndex(treeNodeColumn);
    var $columnIndex = this.getVMColumnIndex(treeNodeColumn);
    var validRows = toggleMethod ? rows.filter(function (row) {
      return toggleMethod({
        expanded: expanded,
        column: treeNodeColumn,
        columnIndex: columnIndex,
        $columnIndex: $columnIndex,
        row: row
      });
    }) : rows;

    if (accordion) {
      validRows = validRows.length ? [validRows[validRows.length - 1]] : []; // 同一级只能展开一个

      var matchObj = _xeUtils.default.findTree(tableFullData, function (item) {
        return item === validRows[0];
      }, treeOpts);

      if (matchObj) {
        _xeUtils.default.remove(treeExpandeds, function (item) {
          return matchObj.items.indexOf(item) > -1;
        });
      }
    }

    if (expanded) {
      validRows.forEach(function (row) {
        if (treeExpandeds.indexOf(row) === -1) {
          var rest = fullAllDataRowMap.get(row);
          var isLoad = lazy && row[hasChild] && !rest.treeLoaded && treeLazyLoadeds.indexOf(row) === -1; // 是否使用懒加载

          if (isLoad) {
            result.push(_this45.handleAsyncTreeExpandChilds(row));
          } else {
            if (row[children] && row[children].length) {
              treeExpandeds.push(row);
            }
          }
        }
      });
    } else {
      _xeUtils.default.remove(treeExpandeds, function (row) {
        return validRows.indexOf(row) > -1;
      });
    }

    if (reserve) {
      validRows.forEach(function (row) {
        return _this45.handleTreeExpandReserve(row, expanded);
      });
    }

    return Promise.all(result).then(this.recalculate);
  },

  /**
   * 虚拟树的展开与收起
   * @param rows
   * @param expanded
   * @returns
   */
  handleVirtualTreeExpand: function handleVirtualTreeExpand(rows, expanded) {
    var _this46 = this;

    return this.handleBaseTreeExpand(rows, expanded).then(function () {
      _this46.handleVirtualTreeToList();

      return _this46.handleTableData();
    }).then(function () {
      return _this46.recalculate();
    });
  },

  /**
   * 设置展开树形节点，二个参数设置这一行展开与否
   * 支持单行
   * 支持多行
   * @param {Array/Row} rows 行数据
   * @param {Boolean} expanded 是否展开
   */
  setTreeExpand: function setTreeExpand(rows, expanded) {
    var treeOpts = this.treeOpts;
    var transform = treeOpts.transform;

    if (rows) {
      if (!_xeUtils.default.isArray(rows)) {
        rows = [rows];
      }

      if (rows.length) {
        // 如果为虚拟树
        if (transform) {
          return this.handleVirtualTreeExpand(rows, expanded);
        } else {
          return this.handleBaseTreeExpand(rows, expanded);
        }
      }
    }

    return this.$nextTick();
  },

  /**
   * 判断行是否为树形节点展开状态
   * @param {Row} row 行对象
   */
  isTreeExpandByRow: function isTreeExpandByRow(row) {
    return this.treeExpandeds.indexOf(row) > -1;
  },

  /**
   * 手动清空树形节点的展开状态，数据会恢复成未展开的状态
   */
  clearTreeExpand: function clearTreeExpand() {
    var _this47 = this;

    var treeOpts = this.treeOpts,
        treeExpandeds = this.treeExpandeds,
        tableFullData = this.tableFullData;
    var transform = treeOpts.transform,
        reserve = treeOpts.reserve;
    var isExists = treeExpandeds.length;
    this.treeExpandeds = [];

    if (reserve) {
      _xeUtils.default.eachTree(tableFullData, function (row) {
        return _this47.handleTreeExpandReserve(row, false);
      }, treeOpts);
    }

    return this.handleTableData().then(function () {
      if (transform) {
        _this47.handleVirtualTreeToList();

        return _this47.handleTableData();
      }
    }).then(function () {
      if (isExists) {
        _this47.recalculate();
      }
    });
  },
  clearTreeExpandReserve: function clearTreeExpandReserve() {
    this.treeExpandedReserveRowMap = {};
    return this.$nextTick();
  },
  handleTreeExpandReserve: function handleTreeExpandReserve(row, expanded) {
    var treeExpandedReserveRowMap = this.treeExpandedReserveRowMap,
        treeOpts = this.treeOpts;

    if (treeOpts.reserve) {
      var rowid = (0, _util.getRowid)(this, row);

      if (expanded) {
        treeExpandedReserveRowMap[rowid] = row;
      } else if (treeExpandedReserveRowMap[rowid]) {
        delete treeExpandedReserveRowMap[rowid];
      }
    }
  },

  /**
   * 获取表格的滚动状态
   */
  getScroll: function getScroll() {
    var $refs = this.$refs,
        scrollXLoad = this.scrollXLoad,
        scrollYLoad = this.scrollYLoad;
    var bodyElem = $refs.tableBody.$el;
    return {
      virtualX: scrollXLoad,
      virtualY: scrollYLoad,
      scrollTop: bodyElem.scrollTop,
      scrollLeft: bodyElem.scrollLeft
    };
  },

  /**
   * 横向 X 可视渲染事件处理
   */
  triggerScrollXEvent: function triggerScrollXEvent() {
    this.loadScrollXData();
  },
  loadScrollXData: function loadScrollXData() {
    var mergeList = this.mergeList,
        mergeFooterList = this.mergeFooterList,
        scrollXStore = this.scrollXStore;
    var startIndex = scrollXStore.startIndex,
        endIndex = scrollXStore.endIndex,
        offsetSize = scrollXStore.offsetSize;

    var _computeVirtualX2 = computeVirtualX(this),
        toVisibleIndex = _computeVirtualX2.toVisibleIndex,
        visibleSize = _computeVirtualX2.visibleSize;

    var offsetItem = {
      startIndex: Math.max(0, toVisibleIndex - 1 - offsetSize),
      endIndex: toVisibleIndex + visibleSize + offsetSize
    };
    calculateMergerOffserIndex(mergeList.concat(mergeFooterList), offsetItem, 'col');
    var offsetStartIndex = offsetItem.startIndex,
        offsetEndIndex = offsetItem.endIndex;

    if (toVisibleIndex <= startIndex || toVisibleIndex >= endIndex - visibleSize - 1) {
      if (startIndex !== offsetStartIndex || endIndex !== offsetEndIndex) {
        scrollXStore.startIndex = offsetStartIndex;
        scrollXStore.endIndex = offsetEndIndex;
        this.updateScrollXData();
      }
    }

    this.closeTooltip();
  },

  /**
   * 纵向 Y 可视渲染事件处理
   */
  triggerScrollYEvent: function triggerScrollYEvent(evnt) {
    var scrollYStore = this.scrollYStore;
    var adaptive = scrollYStore.adaptive,
        offsetSize = scrollYStore.offsetSize,
        visibleSize = scrollYStore.visibleSize; // webkit 浏览器使用最佳的渲染方式，且最高渲染量不能大于 40 条

    if (isWebkit && adaptive && offsetSize * 2 + visibleSize <= 40) {
      this.loadScrollYData(evnt);
    } else {
      this.debounceScrollY(evnt);
    }
  },
  debounceScrollY: _xeUtils.default.debounce(function (evnt) {
    this.loadScrollYData(evnt);
  }, debounceScrollYDuration, {
    leading: false,
    trailing: true
  }),

  /**
   * 纵向 Y 可视渲染处理
   */
  loadScrollYData: function loadScrollYData(evnt) {
    var mergeList = this.mergeList,
        scrollYStore = this.scrollYStore;
    var startIndex = scrollYStore.startIndex,
        endIndex = scrollYStore.endIndex,
        visibleSize = scrollYStore.visibleSize,
        offsetSize = scrollYStore.offsetSize,
        rowHeight = scrollYStore.rowHeight;
    var scrollBodyElem = evnt.currentTarget || evnt.target;
    var scrollTop = scrollBodyElem.scrollTop;
    var toVisibleIndex = Math.floor(scrollTop / rowHeight);
    var offsetItem = {
      startIndex: Math.max(0, toVisibleIndex - 1 - offsetSize),
      endIndex: toVisibleIndex + visibleSize + offsetSize
    };
    calculateMergerOffserIndex(mergeList, offsetItem, 'row');
    var offsetStartIndex = offsetItem.startIndex,
        offsetEndIndex = offsetItem.endIndex;

    if (toVisibleIndex <= startIndex || toVisibleIndex >= endIndex - visibleSize - 1) {
      if (startIndex !== offsetStartIndex || endIndex !== offsetEndIndex) {
        scrollYStore.startIndex = offsetStartIndex;
        scrollYStore.endIndex = offsetEndIndex;
        this.updateScrollYData();
      }
    }
  },
  // 计算可视渲染相关数据
  computeScrollLoad: function computeScrollLoad() {
    var _this48 = this;

    return this.$nextTick().then(function () {
      var sYOpts = _this48.sYOpts,
          sXOpts = _this48.sXOpts,
          scrollXLoad = _this48.scrollXLoad,
          scrollYLoad = _this48.scrollYLoad,
          scrollXStore = _this48.scrollXStore,
          scrollYStore = _this48.scrollYStore; // 计算 X 逻辑

      if (scrollXLoad) {
        var _computeVirtualX3 = computeVirtualX(_this48),
            visibleXSize = _computeVirtualX3.visibleSize;

        var offsetXSize = sXOpts.oSize ? _xeUtils.default.toNumber(sXOpts.oSize) : _dom.browse.msie ? 10 : _dom.browse.edge ? 5 : 0;
        scrollXStore.offsetSize = offsetXSize;
        scrollXStore.visibleSize = visibleXSize;
        scrollXStore.endIndex = Math.max(scrollXStore.startIndex + scrollXStore.visibleSize + offsetXSize, scrollXStore.endIndex);

        _this48.updateScrollXData();
      } else {
        _this48.updateScrollXSpace();
      } // 计算 Y 逻辑


      var _computeVirtualY = computeVirtualY(_this48),
          rowHeight = _computeVirtualY.rowHeight,
          visibleYSize = _computeVirtualY.visibleSize;

      scrollYStore.rowHeight = rowHeight;

      if (scrollYLoad) {
        var offsetYSize = sYOpts.oSize ? _xeUtils.default.toNumber(sYOpts.oSize) : _dom.browse.msie ? 20 : _dom.browse.edge ? 10 : 0;
        scrollYStore.offsetSize = offsetYSize;
        scrollYStore.visibleSize = visibleYSize;
        scrollYStore.endIndex = Math.max(scrollYStore.startIndex + visibleYSize + offsetYSize, scrollYStore.endIndex);

        _this48.updateScrollYData();
      } else {
        _this48.updateScrollYSpace();
      }

      _this48.rowHeight = rowHeight;

      _this48.$nextTick(_this48.updateStyle);
    });
  },
  handleTableColumn: function handleTableColumn() {
    var scrollXLoad = this.scrollXLoad,
        visibleColumn = this.visibleColumn,
        scrollXStore = this.scrollXStore;
    this.tableColumn = scrollXLoad ? visibleColumn.slice(scrollXStore.startIndex, scrollXStore.endIndex) : visibleColumn.slice(0);
  },
  updateScrollXData: function updateScrollXData() {
    var _this49 = this;

    this.tableColumn = [];
    this.$nextTick(function () {
      _this49.handleTableColumn();

      _this49.updateScrollXSpace();
    });
  },
  // 更新横向 X 可视渲染上下剩余空间大小
  updateScrollXSpace: function updateScrollXSpace() {
    var $refs = this.$refs,
        elemStore = this.elemStore,
        visibleColumn = this.visibleColumn,
        scrollXStore = this.scrollXStore,
        scrollXLoad = this.scrollXLoad,
        tableWidth = this.tableWidth,
        scrollbarWidth = this.scrollbarWidth;
    var tableHeader = $refs.tableHeader,
        tableBody = $refs.tableBody,
        tableFooter = $refs.tableFooter;
    var tableBodyElem = tableBody ? tableBody.$el : null;

    if (tableBodyElem) {
      var tableHeaderElem = tableHeader ? tableHeader.$el : null;
      var tableFooterElem = tableFooter ? tableFooter.$el : null;
      var headerElem = tableHeaderElem ? tableHeaderElem.querySelector('.vxe-table--header') : null;
      var bodyElem = tableBodyElem.querySelector('.vxe-table--body');
      var footerElem = tableFooterElem ? tableFooterElem.querySelector('.vxe-table--footer') : null;
      var leftSpaceWidth = visibleColumn.slice(0, scrollXStore.startIndex).reduce(function (previous, column) {
        return previous + column.renderWidth;
      }, 0);
      var marginLeft = '';

      if (scrollXLoad) {
        marginLeft = "".concat(leftSpaceWidth, "px");
      }

      if (headerElem) {
        headerElem.style.marginLeft = marginLeft;
      }

      bodyElem.style.marginLeft = marginLeft;

      if (footerElem) {
        footerElem.style.marginLeft = marginLeft;
      }

      var containerList = ['main'];
      containerList.forEach(function (name) {
        var layoutList = ['header', 'body', 'footer'];
        layoutList.forEach(function (layout) {
          var xSpaceElem = elemStore["".concat(name, "-").concat(layout, "-xSpace")];

          if (xSpaceElem) {
            xSpaceElem.style.width = scrollXLoad ? "".concat(tableWidth + (layout === 'header' ? scrollbarWidth : 0), "px") : '';
          }
        });
      });
      this.$nextTick(this.updateStyle);
    }
  },
  updateScrollYData: function updateScrollYData() {
    var _this50 = this;

    this.tableData = [];
    this.$nextTick(function () {
      _this50.handleTableData();

      _this50.updateScrollYSpace();
    });
  },
  // 更新纵向 Y 可视渲染上下剩余空间大小
  updateScrollYSpace: function updateScrollYSpace() {
    var elemStore = this.elemStore,
        scrollYStore = this.scrollYStore,
        scrollYLoad = this.scrollYLoad,
        afterFullData = this.afterFullData;
    var startIndex = scrollYStore.startIndex,
        rowHeight = scrollYStore.rowHeight;
    var bodyHeight = afterFullData.length * rowHeight;
    var topSpaceHeight = Math.max(0, startIndex * rowHeight);
    var containerList = ['main', 'left', 'right'];
    var marginTop = '';
    var ySpaceHeight = '';

    if (scrollYLoad) {
      marginTop = "".concat(topSpaceHeight, "px");
      ySpaceHeight = "".concat(bodyHeight, "px");
    }

    containerList.forEach(function (name) {
      var layoutList = ['header', 'body', 'footer'];
      var tableElem = elemStore["".concat(name, "-body-table")];

      if (tableElem) {
        tableElem.style.marginTop = marginTop;
      }

      layoutList.forEach(function (layout) {
        var ySpaceElem = elemStore["".concat(name, "-").concat(layout, "-ySpace")];

        if (ySpaceElem) {
          ySpaceElem.style.height = ySpaceHeight;
        }
      });
    });
    this.$nextTick(this.updateStyle);
  },

  /**
   * 如果有滚动条，则滚动到对应的位置
   * @param {Number} scrollLeft 左距离
   * @param {Number} scrollTop 上距离
   */
  scrollTo: function scrollTo(scrollLeft, scrollTop) {
    var _this51 = this;

    var $refs = this.$refs;
    var tableBody = $refs.tableBody,
        rightBody = $refs.rightBody,
        tableFooter = $refs.tableFooter;
    var tableBodyElem = tableBody ? tableBody.$el : null;
    var rightBodyElem = rightBody ? rightBody.$el : null;
    var tableFooterElem = tableFooter ? tableFooter.$el : null;

    if (_xeUtils.default.isNumber(scrollLeft)) {
      (0, _dom.setScrollLeft)(tableFooterElem || tableBodyElem, scrollLeft);
    }

    if (_xeUtils.default.isNumber(scrollTop)) {
      (0, _dom.setScrollTop)(rightBodyElem || tableBodyElem, scrollTop);
    }

    if (this.scrollXLoad || this.scrollYLoad) {
      return new Promise(function (resolve) {
        return setTimeout(function () {
          return resolve(_this51.$nextTick());
        }, 50);
      });
    }

    return this.$nextTick();
  },

  /**
   * 如果有滚动条，则滚动到对应的行
   * @param {Row} row 行对象
   * @param {ColumnInfo} column 列配置
   */
  scrollToRow: function scrollToRow(row, fieldOrColumn) {
    var rest = [];

    if (row) {
      if (this.treeConfig) {
        rest.push(this.scrollToTreeRow(row));
      } else {
        rest.push(_dom.default.rowToVisible(this, row));
      }
    }

    if (fieldOrColumn) {
      rest.push(this.scrollToColumn(fieldOrColumn));
    }

    return Promise.all(rest);
  },

  /**
   * 如果有滚动条，则滚动到对应的列
   * @param {ColumnInfo} column 列配置
   */
  scrollToColumn: function scrollToColumn(fieldOrColumn) {
    var column = (0, _util.handleFieldOrColumn)(this, fieldOrColumn);

    if (column && this.fullColumnMap.has(column)) {
      return _dom.default.colToVisible(this, column);
    }

    return this.$nextTick();
  },

  /**
   * 对于树形结构中，可以直接滚动到指定深层节点中
   * 对于某些特定的场景可能会用到，比如定位到某一节点
   * @param {Row} row 行对象
   */
  scrollToTreeRow: function scrollToTreeRow(row) {
    var _this52 = this;

    var tableFullData = this.tableFullData,
        treeConfig = this.treeConfig,
        treeOpts = this.treeOpts;
    var rests = [];

    if (treeConfig) {
      var matchObj = _xeUtils.default.findTree(tableFullData, function (item) {
        return item === row;
      }, treeOpts);

      if (matchObj) {
        var nodes = matchObj.nodes;
        nodes.forEach(function (row, index) {
          if (index < nodes.length - 1 && !_this52.isTreeExpandByRow(row)) {
            rests.push(_this52.setTreeExpand(row, true));
          }
        });
      }
    }

    return Promise.all(rests).then(function () {
      return _dom.default.rowToVisible(_this52, row);
    });
  },

  /**
   * 手动清除滚动相关信息，还原到初始状态
   */
  clearScroll: function clearScroll() {
    var $refs = this.$refs,
        scrollXStore = this.scrollXStore,
        scrollYStore = this.scrollYStore;
    var tableBody = $refs.tableBody,
        rightBody = $refs.rightBody,
        tableFooter = $refs.tableFooter;
    var tableBodyElem = tableBody ? tableBody.$el : null;
    var rightBodyElem = rightBody ? rightBody.$el : null;
    var tableFooterElem = tableFooter ? tableFooter.$el : null;

    if (rightBodyElem) {
      (0, _util.restoreScrollListener)(rightBodyElem);
      rightBodyElem.scrollTop = 0;
    }

    if (tableFooterElem) {
      tableFooterElem.scrollLeft = 0;
    }

    if (tableBodyElem) {
      (0, _util.restoreScrollListener)(tableBodyElem);
      tableBodyElem.scrollTop = 0;
      tableBodyElem.scrollLeft = 0;
    }

    scrollXStore.startIndex = 0;
    scrollYStore.startIndex = 0;
    return this.$nextTick();
  },

  /**
   * 更新表尾合计
   */
  updateFooter: function updateFooter() {
    var showFooter = this.showFooter,
        visibleColumn = this.visibleColumn,
        footerMethod = this.footerMethod;

    if (showFooter && footerMethod) {
      this.footerTableData = visibleColumn.length ? footerMethod({
        columns: visibleColumn,
        data: this.afterFullData,
        $table: this,
        $grid: this.$xegrid
      }) : [];
    }

    return this.$nextTick();
  },

  /**
   * 更新列状态
   * 如果组件值 v-model 发生 change 时，调用改函数用于更新某一列编辑状态
   * 如果单元格配置了校验规则，则会进行校验
   */
  updateStatus: function updateStatus(scope, cellValue) {
    var _this53 = this;

    var customVal = !_xeUtils.default.isUndefined(cellValue);
    return this.$nextTick().then(function () {
      var $refs = _this53.$refs,
          editRules = _this53.editRules,
          validStore = _this53.validStore;

      if (scope && $refs.tableBody && editRules) {
        var row = scope.row,
            column = scope.column;
        var type = 'change';

        if (_this53.hasCellRules(type, row, column)) {
          var cell = _this53.getCell(row, column);

          if (cell) {
            return _this53.validCellRules(type, row, column, cellValue).then(function () {
              if (customVal && validStore.visible) {
                setCellValue(row, column, cellValue);
              }

              _this53.clearValidate();
            }).catch(function (_ref8) {
              var rule = _ref8.rule;

              if (customVal) {
                setCellValue(row, column, cellValue);
              }

              _this53.showValidTooltip({
                rule: rule,
                row: row,
                column: column,
                cell: cell
              });
            });
          }
        }
      }
    });
  },
  handleDefaultMergeCells: function handleDefaultMergeCells() {
    this.setMergeCells(this.mergeCells);
  },

  /**
   * 设置合并单元格
   * @param {TableMergeConfig[]} merges { row: Row|number, column: ColumnInfo|number, rowspan: number, colspan: number }
   */
  setMergeCells: function setMergeCells(merges) {
    var _this54 = this;

    if (this.spanMethod) {
      (0, _log.errLog)('vxe.error.errConflicts', ['merge-cells', 'span-method']);
    }

    setMerges(this, merges, this.mergeList, this.afterFullData);
    return this.$nextTick().then(function () {
      return _this54.updateCellAreas();
    });
  },

  /**
   * 移除单元格合并
   * @param {TableMergeConfig[]} merges 多个或数组 [{row:Row|number, col:ColumnInfo|number}]
   */
  removeMergeCells: function removeMergeCells(merges) {
    var _this55 = this;

    if (this.spanMethod) {
      (0, _log.errLog)('vxe.error.errConflicts', ['merge-cells', 'span-method']);
    }

    var rest = removeMerges(this, merges, this.mergeList, this.afterFullData);
    return this.$nextTick().then(function () {
      _this55.updateCellAreas();

      return rest;
    });
  },

  /**
   * 获取所有被合并的单元格
   */
  getMergeCells: function getMergeCells() {
    return this.mergeList.slice(0);
  },

  /**
   * 清除所有单元格合并
   */
  clearMergeCells: function clearMergeCells() {
    this.mergeList = [];
    return this.$nextTick();
  },
  handleDefaultMergeFooterItems: function handleDefaultMergeFooterItems() {
    this.setMergeFooterItems(this.mergeFooterItems);
  },
  setMergeFooterItems: function setMergeFooterItems(merges) {
    var _this56 = this;

    if (this.footerSpanMethod) {
      (0, _log.errLog)('vxe.error.errConflicts', ['merge-footer-items', 'footer-span-method']);
    }

    setMerges(this, merges, this.mergeFooterList, null);
    return this.$nextTick().then(function () {
      return _this56.updateCellAreas();
    });
  },
  removeMergeFooterItems: function removeMergeFooterItems(merges) {
    var _this57 = this;

    if (this.footerSpanMethod) {
      (0, _log.errLog)('vxe.error.errConflicts', ['merge-footer-items', 'footer-span-method']);
    }

    var rest = removeMerges(this, merges, this.mergeFooterList, null);
    return this.$nextTick().then(function () {
      _this57.updateCellAreas();

      return rest;
    });
  },

  /**
   * 获取所有被合并的表尾
   */
  getMergeFooterItems: function getMergeFooterItems() {
    return this.mergeFooterList.slice(0);
  },

  /**
   * 清除所有表尾合并
   */
  clearMergeFooterItems: function clearMergeFooterItems() {
    this.mergeFooterList = [];
    return this.$nextTick();
  },
  updateZindex: function updateZindex() {
    if (this.zIndex) {
      this.tZindex = this.zIndex;
    } else if (this.tZindex < _utils.default.getLastZIndex()) {
      this.tZindex = _utils.default.nextZIndex();
    }
  },
  updateCellAreas: function updateCellAreas() {
    if (this.mouseConfig && this.mouseOpts.area && this.handleUpdateCellAreas) {
      this.handleUpdateCellAreas();
    }
  },
  emitEvent: function emitEvent(type, params, evnt) {
    this.$emit(type, Object.assign({
      $table: this,
      $grid: this.$xegrid,
      $event: evnt
    }, params));
  },
  focus: function focus() {
    this.isActivated = true;
    return this.$nextTick();
  },
  blur: function blur() {
    this.isActivated = false;
    return this.$nextTick();
  },
  // 连接工具栏
  connect: function connect($toolbar) {
    if ($toolbar && $toolbar.syncUpdate) {
      $toolbar.syncUpdate({
        collectColumn: this.collectColumn,
        $table: this
      });
      this.$toolbar = $toolbar;
    } else {
      (0, _log.errLog)('vxe.error.barUnableLink');
    }

    return this.$nextTick();
  },

  /*************************
   * Publish methods
   *************************/
  getCell: function getCell(row, column) {
    var $refs = this.$refs;
    var rowid = (0, _util.getRowid)(this, row);
    var bodyElem = $refs["".concat(column.fixed || 'table', "Body")] || $refs.tableBody;

    if (bodyElem && bodyElem.$el) {
      return bodyElem.$el.querySelector(".vxe-body--row[rowid=\"".concat(rowid, "\"] .").concat(column.id));
    }

    return null;
  },
  getCellLabel: function getCellLabel(row, column) {
    var formatter = column.formatter;

    var cellValue = _utils.default.getCellValue(row, column);

    var cellLabel = cellValue;

    if (formatter) {
      var rest, formatData;
      var fullAllDataRowMap = this.fullAllDataRowMap;
      var colid = column.id;
      var cacheFormat = fullAllDataRowMap.has(row);

      if (cacheFormat) {
        rest = fullAllDataRowMap.get(row);
        formatData = rest.formatData;

        if (!formatData) {
          formatData = fullAllDataRowMap.get(row).formatData = {};
        }

        if (rest && formatData[colid]) {
          if (formatData[colid].value === cellValue) {
            return formatData[colid].label;
          }
        }
      }

      var formatParams = {
        cellValue: cellValue,
        row: row,
        rowIndex: this.getRowIndex(row),
        column: column,
        columnIndex: this.getColumnIndex(column)
      };

      if (_xeUtils.default.isString(formatter)) {
        var globalFunc = _formats.formats.get(formatter);

        cellLabel = globalFunc ? globalFunc(formatParams) : '';
      } else if (_xeUtils.default.isArray(formatter)) {
        var _globalFunc = _formats.formats.get(formatter[0]);

        cellLabel = _globalFunc ? _globalFunc.apply(void 0, [formatParams].concat(_toConsumableArray(formatter.slice(1)))) : '';
      } else {
        cellLabel = formatter(formatParams);
      }

      if (formatData) {
        formatData[colid] = {
          value: cellValue,
          label: cellLabel
        };
      }
    }

    return cellLabel;
  },

  /*************************
   * Publish methods
   *************************/
  getSetupOptions: function getSetupOptions() {
    return _conf.default;
  }
}; // Module methods

var funcs = 'setFilter,openFilter,clearFilter,getCheckedFilters,closeMenu,setActiveCellArea,getActiveCellArea,getCellAreas,clearCellAreas,copyCellArea,cutCellArea,pasteCellArea,getCopyCellArea,getCopyCellAreas,clearCopyCellArea,setCellAreas,openFind,openReplace,closeFNR,getSelectedCell,clearSelected,insert,insertAt,remove,removeCheckboxRow,removeRadioRow,removeCurrentRow,getRecordset,getInsertRecords,getRemoveRecords,getUpdateRecords,clearActived,getActiveRecord,isActiveByRow,setActiveRow,setActiveCell,setSelectCell,clearValidate,fullValidate,validate,openExport,openPrint,exportData,openImport,importData,saveFile,readFile,importByFile,print'.split(',');
funcs.forEach(function (name) {
  Methods[name] = function () {
    if (process.env.NODE_ENV === 'development') {
      if (!this["_".concat(name)]) {
        if ('openExport,openPrint,exportData,openImport,importData,saveFile,readFile,importByFile,print'.split(',').includes(name)) {
          (0, _log.errLog)('vxe.error.reqModule', ['Export']);
        } else if ('clearValidate,fullValidate,validate'.split(',').includes(name)) {
          (0, _log.errLog)('vxe.error.reqModule', ['Validator']);
        }
      }
    }

    return this["_".concat(name)] ? this["_".concat(name)].apply(this, arguments) : null;
  };
});
var _default = Methods;
exports.default = _default;