"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _dom = _interopRequireDefault(require("../../tools/dom"));

var _util = require("../../table/src/util");

var _vXETable = _interopRequireDefault(require("../../v-x-e-table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  methods: {
    /**
     * 手动弹出筛选面板
     * @param column
     */
    _openFilter: function _openFilter(fieldOrColumn) {
      var column = (0, _util.handleFieldOrColumn)(this, fieldOrColumn);

      if (column && column.filters) {
        var elemStore = this.elemStore;
        var fixed = column.fixed;
        return this.scrollToColumn(column).then(function () {
          var headerWrapperElem = elemStore["".concat(fixed || 'main', "-header-wrapper")] || elemStore['main-header-wrapper'];

          if (headerWrapperElem) {
            var filterBtnElem = headerWrapperElem.querySelector(".vxe-header--column.".concat(column.id, " .vxe-filter--btn"));

            _dom.default.triggerEvent(filterBtnElem, 'click');
          }
        });
      }

      return this.$nextTick();
    },

    /**
     * 修改筛选条件列表
     * @param {ColumnInfo} fieldOrColumn 列
     * @param {Array} options 选项
     */
    _setFilter: function _setFilter(fieldOrColumn, options) {
      var column = (0, _util.handleFieldOrColumn)(this, fieldOrColumn);

      if (column && column.filters && options) {
        column.filters = (0, _util.toFilters)(options);
      }

      return this.$nextTick();
    },
    checkFilterOptions: function checkFilterOptions() {
      var filterStore = this.filterStore;
      filterStore.isAllSelected = filterStore.options.every(function (item) {
        return item._checked;
      });
      filterStore.isIndeterminate = !filterStore.isAllSelected && filterStore.options.some(function (item) {
        return item._checked;
      });
    },

    /**
     * 点击筛选事件
     * 当筛选图标被点击时触发
     * 更新选项是否全部状态
     * 打开筛选面板
     * @param {Event} evnt 事件
     * @param {ColumnInfo} column 列配置
     * @param {Object} params 参数
     */
    triggerFilterEvent: function triggerFilterEvent(evnt, column, params) {
      var _this = this;

      var filterStore = this.filterStore;

      if (filterStore.column === column && filterStore.visible) {
        filterStore.visible = false;
      } else {
        var targetElem = evnt.target,
            pageX = evnt.pageX;
        var filters = column.filters,
            filterMultiple = column.filterMultiple,
            filterRender = column.filterRender;
        var compConf = filterRender ? _vXETable.default.renderer.get(filterRender.name) : null;
        var filterRecoverMethod = column.filterRecoverMethod || (compConf ? compConf.filterRecoverMethod : null);

        var _DomTools$getDomNode = _dom.default.getDomNode(),
            visibleWidth = _DomTools$getDomNode.visibleWidth;

        Object.assign(filterStore, {
          args: params,
          multiple: filterMultiple,
          options: filters,
          column: column,
          style: null,
          visible: true
        }); // 复原状态

        filterStore.options.forEach(function (option) {
          var _checked = option._checked,
              checked = option.checked;
          option._checked = checked;

          if (!checked && _checked !== checked) {
            if (filterRecoverMethod) {
              filterRecoverMethod({
                option: option,
                column: column,
                $table: _this
              });
            }
          }
        });
        this.checkFilterOptions();
        this.initStore.filter = true;
        this.$nextTick(function () {
          var $refs = _this.$refs;
          var bodyElem = $refs.tableBody.$el;
          var filterWrapperElem = $refs.filterWrapper.$el;
          var filterWidth = 0;
          var filterHeight = 0;
          var filterHeadElem = null;
          var filterFootElem = null;

          if (filterWrapperElem) {
            filterWidth = filterWrapperElem.offsetWidth;
            filterHeight = filterWrapperElem.offsetHeight;
            filterHeadElem = filterWrapperElem.querySelector('.vxe-table--filter-header');
            filterFootElem = filterWrapperElem.querySelector('.vxe-table--filter-footer');
          }

          var centerWidth = filterWidth / 2;
          var minMargin = 10;
          var maxLeft = bodyElem.clientWidth - filterWidth - minMargin;
          var left, right;
          var style = {
            top: "".concat(targetElem.offsetTop + targetElem.offsetParent.offsetTop + targetElem.offsetHeight + 8, "px")
          }; // 判断面板不能大于表格高度

          var maxHeight = null;

          if (filterHeight >= bodyElem.clientHeight) {
            maxHeight = Math.max(60, bodyElem.clientHeight - (filterFootElem ? filterFootElem.offsetHeight : 0) - (filterHeadElem ? filterHeadElem.offsetHeight : 0));
          }

          if (column.fixed === 'left') {
            left = targetElem.offsetLeft + targetElem.offsetParent.offsetLeft - centerWidth;
          } else if (column.fixed === 'right') {
            right = targetElem.offsetParent.offsetWidth - targetElem.offsetLeft + (targetElem.offsetParent.offsetParent.offsetWidth - targetElem.offsetParent.offsetLeft) - column.renderWidth - centerWidth;
          } else {
            left = targetElem.offsetLeft + targetElem.offsetParent.offsetLeft - centerWidth - bodyElem.scrollLeft;
          }

          if (left) {
            var overflowWidth = pageX + filterWidth - centerWidth + minMargin - visibleWidth;

            if (overflowWidth > 0) {
              left -= overflowWidth;
            }

            style.left = "".concat(Math.min(maxLeft, Math.max(minMargin, left)), "px");
          } else if (right) {
            var _overflowWidth = pageX + filterWidth - centerWidth + minMargin - visibleWidth;

            if (_overflowWidth > 0) {
              right += _overflowWidth;
            }

            style.right = "".concat(Math.max(minMargin, right), "px");
          }

          filterStore.style = style;
          filterStore.maxHeight = maxHeight;
        });
      }

      this.emitEvent('filter-visible', {
        column: column,
        property: column.property,
        filterList: this.getCheckedFilters(),
        visible: filterStore.visible
      }, evnt);
    },
    _getCheckedFilters: function _getCheckedFilters() {
      var tableFullColumn = this.tableFullColumn;
      var filterList = [];
      tableFullColumn.filter(function (column) {
        var property = column.property,
            filters = column.filters;
        var valueList = [];
        var dataList = [];

        if (filters && filters.length) {
          filters.forEach(function (item) {
            if (item.checked) {
              valueList.push(item.value);
              dataList.push(item.data);
            }
          });

          if (valueList.length) {
            filterList.push({
              column: column,
              property: property,
              values: valueList,
              datas: dataList
            });
          }
        }
      });
      return filterList;
    },

    /**
     * 确认筛选
     * 当筛选面板中的确定按钮被按下时触发
     * @param {Event} evnt 事件
     */
    confirmFilterEvent: function confirmFilterEvent(evnt) {
      var _this2 = this;

      var filterStore = this.filterStore,
          filterOpts = this.filterOpts,
          oldScrollXLoad = this.scrollXLoad,
          oldScrollYLoad = this.scrollYLoad;
      var column = filterStore.column;
      var property = column.property;
      var values = [];
      var datas = [];
      column.filters.forEach(function (item) {
        if (item.checked) {
          values.push(item.value);
          datas.push(item.data);
        }
      });
      var filterList = this.getCheckedFilters(); // 如果是服务端筛选，则跳过本地筛选处理

      if (!filterOpts.remote) {
        this.handleTableData(true);
        this.checkSelectionStatus();
      }

      this.emitEvent('filter-change', {
        column: column,
        property: property,
        values: values,
        datas: datas,
        filters: filterList,
        filterList: filterList
      }, evnt);
      this.closeFilter();
      this.updateFooter().then(function () {
        var scrollXLoad = _this2.scrollXLoad,
            scrollYLoad = _this2.scrollYLoad;

        if (oldScrollXLoad || scrollXLoad || oldScrollYLoad || scrollYLoad) {
          if (oldScrollXLoad || scrollXLoad) {
            _this2.updateScrollXSpace();
          }

          if (oldScrollYLoad || scrollYLoad) {
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
    handleClearFilter: function handleClearFilter(column) {
      if (column) {
        var filters = column.filters,
            filterRender = column.filterRender;

        if (filters) {
          var compConf = filterRender ? _vXETable.default.renderer.get(filterRender.name) : null;
          var filterResetMethod = column.filterResetMethod || (compConf ? compConf.filterResetMethod : null);
          filters.forEach(function (item) {
            item._checked = false;
            item.checked = false;

            if (!filterResetMethod) {
              item.data = _xeUtils.default.clone(item.resetValue, true);
            }
          });

          if (filterResetMethod) {
            filterResetMethod({
              options: filters,
              column: column,
              $table: this
            });
          }
        }
      }
    },

    /**
     * 重置筛选
     * 当筛选面板中的重置按钮被按下时触发
     * @param {Event} evnt 事件
     */
    resetFilterEvent: function resetFilterEvent(evnt) {
      this.handleClearFilter(this.filterStore.column);
      this.confirmFilterEvent(evnt);
    },

    /**
     * 清空指定列的筛选条件
     * 如果为空则清空所有列的筛选条件
     * @param {String} fieldOrColumn 列
     */
    _clearFilter: function _clearFilter(fieldOrColumn) {
      var filterStore = this.filterStore;
      var column;

      if (fieldOrColumn) {
        column = (0, _util.handleFieldOrColumn)(this, fieldOrColumn);

        if (column) {
          this.handleClearFilter(column);
        }
      } else {
        this.visibleColumn.forEach(this.handleClearFilter);
      }

      if (!fieldOrColumn || column !== filterStore.column) {
        Object.assign(filterStore, {
          isAllSelected: false,
          isIndeterminate: false,
          style: null,
          options: [],
          column: null,
          multiple: false,
          visible: false
        });
      }

      return this.updateData();
    }
  }
};
exports.default = _default;