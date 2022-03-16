"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _table = _interopRequireDefault(require("../../table"));

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _size = _interopRequireDefault(require("../../mixins/size"));

var _vXETable = _interopRequireDefault(require("../../v-x-e-table"));

var _utils = _interopRequireWildcard(require("../../tools/utils"));

var _dom = _interopRequireWildcard(require("../../tools/dom"));

var _event = require("../../tools/event");

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

var methods = {};
var propKeys = Object.keys(_table.default.props);

function renderDefaultForm(h, _vm) {
  var $scopedSlots = _vm.$scopedSlots,
      proxyConfig = _vm.proxyConfig,
      proxyOpts = _vm.proxyOpts,
      formData = _vm.formData,
      formConfig = _vm.formConfig,
      formOpts = _vm.formOpts;

  if ((0, _utils.isEnableConf)(formConfig) && formOpts.items && formOpts.items.length) {
    var formSlots = {};

    if (!formOpts.inited) {
      formOpts.inited = true;
      var beforeItem = proxyOpts.beforeItem;

      if (proxyOpts && beforeItem) {
        formOpts.items.forEach(function (item) {
          beforeItem.call(_vm, {
            $grid: _vm,
            item: item
          });
        });
      }
    } // 处理插槽


    formOpts.items.forEach(function (item) {
      _xeUtils.default.each(item.slots, function (func) {
        if (!_xeUtils.default.isFunction(func)) {
          if ($scopedSlots[func]) {
            formSlots[func] = $scopedSlots[func];
          }
        }
      });
    });
    return [h('vxe-form', {
      props: Object.assign({}, formOpts, {
        data: proxyConfig && proxyOpts.form ? formData : formOpts.data
      }),
      on: {
        submit: _vm.submitEvent,
        reset: _vm.resetEvent,
        collapse: _vm.collapseEvent,
        'submit-invalid': _vm.submitInvalidEvent
      },
      scopedSlots: formSlots
    })];
  }

  return [];
}

function getFuncSlot(_vm, optSlots, slotKey) {
  var $scopedSlots = _vm.$scopedSlots;
  var funcSlot = optSlots[slotKey];

  if (funcSlot) {
    if (_xeUtils.default.isString(funcSlot)) {
      if ($scopedSlots[funcSlot]) {
        return $scopedSlots[funcSlot];
      } else {
        if (process.env.NODE_ENV === 'development') {
          (0, _log.errLog)('vxe.error.notSlot', [funcSlot]);
        }
      }
    } else {
      return funcSlot;
    }
  }

  return null;
}

function getToolbarSlots(_vm) {
  var $scopedSlots = _vm.$scopedSlots,
      toolbarOpts = _vm.toolbarOpts;
  var toolbarOptSlots = toolbarOpts.slots;
  var buttonsSlot;
  var toolsSlot;
  var slots = {};

  if (process.env.NODE_ENV === 'development') {
    if ($scopedSlots.buttons && (!toolbarOptSlots || toolbarOptSlots.buttons !== 'buttons')) {
      (0, _log.warnLog)('vxe.error.reqProp', ['toolbar-config.slots.buttons']);
    }

    if ($scopedSlots.tools && (!toolbarOptSlots || toolbarOptSlots.tools !== 'tools')) {
      (0, _log.warnLog)('vxe.error.reqProp', ['toolbar-config.slots.tools']);
    }
  }

  if (toolbarOptSlots) {
    buttonsSlot = getFuncSlot(_vm, toolbarOptSlots, 'buttons');
    toolsSlot = getFuncSlot(_vm, toolbarOptSlots, 'tools');

    if (buttonsSlot) {
      slots.buttons = buttonsSlot;
    }

    if (toolsSlot) {
      slots.tools = toolsSlot;
    }
  }

  return slots;
}

function getPagerSlots(_vm) {
  var pagerOpts = _vm.pagerOpts;
  var pagerOptSlots = pagerOpts.slots;
  var slots = {};
  var leftSlot;
  var rightSlot;

  if (pagerOptSlots) {
    leftSlot = getFuncSlot(_vm, pagerOptSlots, 'left');
    rightSlot = getFuncSlot(_vm, pagerOptSlots, 'right');

    if (leftSlot) {
      slots.left = leftSlot;
    }

    if (rightSlot) {
      slots.right = rightSlot;
    }
  }

  return slots;
}

function getTableOns(_vm) {
  var $listeners = _vm.$listeners,
      proxyConfig = _vm.proxyConfig,
      proxyOpts = _vm.proxyOpts;
  var ons = {};

  _xeUtils.default.each($listeners, function (cb, type) {
    ons[type] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _vm.$emit.apply(_vm, [type].concat(args));
    };
  });

  if (proxyConfig) {
    if (proxyOpts.sort) {
      ons['sort-change'] = _vm.sortChangeEvent;
    }

    if (proxyOpts.filter) {
      ons['filter-change'] = _vm.filterChangeEvent;
    }
  }

  return ons;
}

Object.keys(_table.default.methods).forEach(function (name) {
  methods[name] = function () {
    var _this$$refs$xTable;

    return this.$refs.xTable && (_this$$refs$xTable = this.$refs.xTable)[name].apply(_this$$refs$xTable, arguments);
  };
});
var _default2 = {
  name: 'VxeGrid',
  mixins: [_size.default],
  props: _objectSpread(_objectSpread({}, _table.default.props), {}, {
    columns: Array,
    pagerConfig: [Boolean, Object],
    proxyConfig: Object,
    toolbar: [Boolean, Object],
    toolbarConfig: [Boolean, Object],
    formConfig: [Boolean, Object],
    zoomConfig: Object,
    size: {
      type: String,
      default: function _default() {
        return _conf.default.grid.size || _conf.default.size;
      }
    }
  }),
  provide: function provide() {
    return {
      $xegrid: this
    };
  },
  data: function data() {
    return {
      tableLoading: false,
      isZMax: false,
      tableData: [],
      pendingRecords: [],
      filterData: [],
      formData: {},
      sortData: [],
      tZindex: 0,
      tablePage: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      }
    };
  },
  computed: {
    isMsg: function isMsg() {
      return this.proxyOpts.message !== false;
    },
    proxyOpts: function proxyOpts() {
      return Object.assign({}, _conf.default.grid.proxyConfig, this.proxyConfig);
    },
    pagerOpts: function pagerOpts() {
      return Object.assign({}, _conf.default.grid.pagerConfig, this.pagerConfig);
    },
    formOpts: function formOpts() {
      return Object.assign({}, _conf.default.grid.formConfig, this.formConfig);
    },
    toolbarOpts: function toolbarOpts() {
      return Object.assign({}, _conf.default.grid.toolbarConfig, this.toolbarConfig || this.toolbar);
    },
    zoomOpts: function zoomOpts() {
      return Object.assign({}, _conf.default.grid.zoomConfig, this.zoomConfig);
    },
    renderStyle: function renderStyle() {
      return this.isZMax ? {
        zIndex: this.tZindex
      } : null;
    },
    tableExtendProps: function tableExtendProps() {
      var _this = this;

      var rest = {};
      propKeys.forEach(function (key) {
        rest[key] = _this[key];
      });
      return rest;
    },
    tableProps: function tableProps() {
      var isZMax = this.isZMax,
          seqConfig = this.seqConfig,
          pagerConfig = this.pagerConfig,
          loading = this.loading,
          editConfig = this.editConfig,
          proxyConfig = this.proxyConfig,
          proxyOpts = this.proxyOpts,
          tableExtendProps = this.tableExtendProps,
          tableLoading = this.tableLoading,
          tablePage = this.tablePage,
          tableData = this.tableData;
      var tableProps = Object.assign({}, tableExtendProps);

      if (isZMax) {
        if (tableExtendProps.maxHeight) {
          tableProps.maxHeight = 'auto';
        } else {
          tableProps.height = 'auto';
        }
      }

      if (proxyConfig) {
        tableProps.loading = loading || tableLoading;
        tableProps.data = tableData;
        tableProps.rowClassName = this.handleRowClassName;

        if (proxyOpts.seq && (0, _utils.isEnableConf)(pagerConfig)) {
          tableProps.seqConfig = Object.assign({}, seqConfig, {
            startIndex: (tablePage.currentPage - 1) * tablePage.pageSize
          });
        }
      }

      if (editConfig) {
        tableProps.editConfig = Object.assign({}, editConfig, {
          activeMethod: this.handleActiveMethod
        });
      }

      return tableProps;
    }
  },
  watch: {
    columns: function columns(value) {
      var _this2 = this;

      this.$nextTick(function () {
        return _this2.loadColumn(value);
      });
    },
    toolbar: function toolbar(value) {
      if (value) {
        this.initToolbar();
      }
    },
    toolbarConfig: function toolbarConfig(value) {
      if (value) {
        this.initToolbar();
      }
    },
    proxyConfig: function proxyConfig() {
      this.initProxy();
    },
    pagerConfig: function pagerConfig() {
      this.initPages();
    }
  },
  created: function created() {
    var data = this.data,
        formOpts = this.formOpts,
        proxyOpts = this.proxyOpts,
        proxyConfig = this.proxyConfig;

    if (proxyConfig && (data || proxyOpts.form && formOpts.data)) {
      (0, _log.errLog)('vxe.error.errConflicts', ['grid.data', 'grid.proxy-config']);
    }

    if (process.env.NODE_ENV === 'development') {
      if (this.toolbar) {
        (0, _log.warnLog)('vxe.error.delProp', ['grid.toolbar', 'grid.toolbar-config']);
      }

      if (this.toolbarConfig && !_xeUtils.default.isObject(this.toolbarConfig)) {
        (0, _log.warnLog)('vxe.error.errProp', ["grid.toolbar-config=".concat(this.toolbarConfig), 'grid.toolbar-config={}']);
      }
    }

    _event.GlobalEvent.on(this, 'keydown', this.handleGlobalKeydownEvent);
  },
  mounted: function mounted() {
    if (this.columns && this.columns.length) {
      this.loadColumn(this.columns);
    }

    this.initToolbar();
    this.initPages();
    this.initProxy();
  },
  destroyed: function destroyed() {
    _event.GlobalEvent.off(this, 'keydown');
  },
  render: function render(h) {
    var _ref;

    var $scopedSlots = this.$scopedSlots,
        vSize = this.vSize,
        isZMax = this.isZMax;
    var hasForm = !!($scopedSlots.form || (0, _utils.isEnableConf)(this.formConfig));
    var hasToolbar = !!($scopedSlots.toolbar || (0, _utils.isEnableConf)(this.toolbarConfig) || this.toolbar);
    var hasPager = !!($scopedSlots.pager || (0, _utils.isEnableConf)(this.pagerConfig));
    return h('div', {
      class: ['vxe-grid', (_ref = {}, _defineProperty(_ref, "size--".concat(vSize), vSize), _defineProperty(_ref, 'is--animat', !!this.animat), _defineProperty(_ref, 'is--round', this.round), _defineProperty(_ref, 'is--maximize', isZMax), _defineProperty(_ref, 'is--loading', this.loading || this.tableLoading), _ref)],
      style: this.renderStyle
    }, [
    /**
     * 渲染表单
     */
    hasForm ? h('div', {
      ref: 'formWrapper',
      class: 'vxe-grid--form-wrapper'
    }, $scopedSlots.form ? $scopedSlots.form.call(this, {
      $grid: this
    }, h) : renderDefaultForm(h, this)) : null,
    /**
     * 渲染工具栏
     */
    hasToolbar ? h('div', {
      ref: 'toolbarWrapper',
      class: 'vxe-grid--toolbar-wrapper'
    }, $scopedSlots.toolbar ? $scopedSlots.toolbar.call(this, {
      $grid: this
    }, h) : [h('vxe-toolbar', {
      props: this.toolbarOpts,
      ref: 'xToolbar',
      scopedSlots: getToolbarSlots(this)
    })]) : null,
    /**
     * 渲染表格顶部区域
     */
    $scopedSlots.top ? h('div', {
      ref: 'topWrapper',
      class: 'vxe-grid--top-wrapper'
    }, $scopedSlots.top.call(this, {
      $grid: this
    }, h)) : null,
    /**
     * 渲染表格
     */
    h('vxe-table', {
      props: this.tableProps,
      on: getTableOns(this),
      scopedSlots: $scopedSlots,
      ref: 'xTable'
    }),
    /**
     * 渲染表格底部区域
     */
    $scopedSlots.bottom ? h('div', {
      ref: 'bottomWrapper',
      class: 'vxe-grid--bottom-wrapper'
    }, $scopedSlots.bottom.call(this, {
      $grid: this
    }, h)) : null,
    /**
     * 渲染分页
     */
    hasPager ? h('div', {
      ref: 'pagerWrapper',
      class: 'vxe-grid--pager-wrapper'
    }, $scopedSlots.pager ? $scopedSlots.pager.call(this, {
      $grid: this
    }, h) : [h('vxe-pager', {
      props: _objectSpread(_objectSpread({}, this.pagerOpts), this.proxyConfig ? this.tablePage : {}),
      on: {
        'page-change': this.pageChangeEvent
      },
      scopedSlots: getPagerSlots(this)
    })]) : null]);
  },
  methods: _objectSpread(_objectSpread({}, methods), {}, {
    callSlot: function callSlot(slotFunc, params, h, vNodes) {
      if (slotFunc) {
        var $scopedSlots = this.$scopedSlots;

        if (_xeUtils.default.isString(slotFunc)) {
          slotFunc = $scopedSlots[slotFunc] || null;
        }

        if (_xeUtils.default.isFunction(slotFunc)) {
          return slotFunc.call(this, params, h, vNodes);
        }
      }

      return [];
    },
    getParentHeight: function getParentHeight() {
      var $el = this.$el,
          isZMax = this.isZMax;
      return (isZMax ? _dom.default.getDomNode().visibleHeight : _xeUtils.default.toNumber(getComputedStyle($el.parentNode).height)) - this.getExcludeHeight();
    },

    /**
     * 获取需要排除的高度
     */
    getExcludeHeight: function getExcludeHeight() {
      var $refs = this.$refs,
          $el = this.$el,
          isZMax = this.isZMax,
          height = this.height;
      var formWrapper = $refs.formWrapper,
          toolbarWrapper = $refs.toolbarWrapper,
          topWrapper = $refs.topWrapper,
          bottomWrapper = $refs.bottomWrapper,
          pagerWrapper = $refs.pagerWrapper;
      var parentPaddingSize = isZMax || height !== 'auto' ? 0 : (0, _dom.getPaddingTopBottomSize)($el.parentNode);
      return parentPaddingSize + (0, _dom.getPaddingTopBottomSize)($el) + (0, _dom.getOffsetHeight)(formWrapper) + (0, _dom.getOffsetHeight)(toolbarWrapper) + (0, _dom.getOffsetHeight)(topWrapper) + (0, _dom.getOffsetHeight)(bottomWrapper) + (0, _dom.getOffsetHeight)(pagerWrapper);
    },
    handleRowClassName: function handleRowClassName(params) {
      var rowClassName = this.rowClassName;
      var clss = [];

      if (this.pendingRecords.some(function (item) {
        return item === params.row;
      })) {
        clss.push('row--pending');
      }

      clss.push(rowClassName ? _xeUtils.default.isFunction(rowClassName) ? rowClassName(params) : rowClassName : '');
      return clss;
    },
    handleActiveMethod: function handleActiveMethod(params) {
      var editConfig = this.editConfig;
      var activeMethod = editConfig ? editConfig.activeMethod : null;
      return this.pendingRecords.indexOf(params.row) === -1 && (!activeMethod || activeMethod(_objectSpread(_objectSpread({}, params), {}, {
        $grid: this
      })));
    },
    initToolbar: function initToolbar() {
      var _this3 = this;

      this.$nextTick(function () {
        var _this3$$refs = _this3.$refs,
            xTable = _this3$$refs.xTable,
            xToolbar = _this3$$refs.xToolbar;

        if (xTable && xToolbar) {
          xTable.connect(xToolbar);
        }
      });
    },
    initPages: function initPages() {
      var tablePage = this.tablePage,
          pagerConfig = this.pagerConfig,
          pagerOpts = this.pagerOpts;
      var currentPage = pagerOpts.currentPage,
          pageSize = pagerOpts.pageSize;

      if (pagerConfig) {
        if (currentPage) {
          tablePage.currentPage = currentPage;
        }

        if (pageSize) {
          tablePage.pageSize = pageSize;
        }
      }
    },
    initProxy: function initProxy() {
      var _this4 = this;

      var proxyInited = this.proxyInited,
          proxyConfig = this.proxyConfig,
          proxyOpts = this.proxyOpts,
          formConfig = this.formConfig,
          formOpts = this.formOpts;

      if (proxyConfig) {
        if ((0, _utils.isEnableConf)(formConfig) && proxyOpts.form && formOpts.items) {
          var formData = {};
          formOpts.items.forEach(function (item) {
            var field = item.field,
                itemRender = item.itemRender;

            if (field) {
              var itemValue = null;

              if (itemRender) {
                var defaultValue = itemRender.defaultValue;

                if (_xeUtils.default.isFunction(defaultValue)) {
                  itemValue = defaultValue({
                    item: item
                  });
                } else if (!_xeUtils.default.isUndefined(defaultValue)) {
                  itemValue = defaultValue;
                }
              }

              formData[field] = itemValue;
            }
          });
          this.formData = formData;
        }

        if (!proxyInited && proxyOpts.autoLoad !== false) {
          this.proxyInited = true;
          this.$nextTick(function () {
            return _this4.commitProxy('_init');
          });
        }
      }
    },
    handleGlobalKeydownEvent: function handleGlobalKeydownEvent(evnt) {
      var isEsc = evnt.keyCode === 27;

      if (isEsc && this.isZMax && this.zoomOpts.escRestore !== false) {
        this.triggerZoomEvent(evnt);
      }
    },

    /**
     * 提交指令，支持 code 或 button
     * @param {String/Object} code 字符串或对象
     */
    commitProxy: function commitProxy(proxyTarget) {
      var _this5 = this;

      var $refs = this.$refs,
          toolbar = this.toolbar,
          toolbarConfig = this.toolbarConfig,
          toolbarOpts = this.toolbarOpts,
          proxyOpts = this.proxyOpts,
          tablePage = this.tablePage,
          pagerConfig = this.pagerConfig,
          editRules = this.editRules,
          formData = this.formData,
          isMsg = this.isMsg;
      var beforeQuery = proxyOpts.beforeQuery,
          afterQuery = proxyOpts.afterQuery,
          beforeDelete = proxyOpts.beforeDelete,
          afterDelete = proxyOpts.afterDelete,
          beforeSave = proxyOpts.beforeSave,
          afterSave = proxyOpts.afterSave,
          _proxyOpts$ajax = proxyOpts.ajax,
          ajax = _proxyOpts$ajax === void 0 ? {} : _proxyOpts$ajax,
          _proxyOpts$props = proxyOpts.props,
          proxyProps = _proxyOpts$props === void 0 ? {} : _proxyOpts$props;
      var $xetable = $refs.xTable;
      var button;
      var code;

      if (_xeUtils.default.isString(proxyTarget)) {
        var matchObj = toolbarConfig || toolbar ? _xeUtils.default.findTree(toolbarOpts.buttons, function (item) {
          return item.code === proxyTarget;
        }, {
          children: 'dropdowns'
        }) : null;
        code = proxyTarget;
        button = matchObj ? matchObj.item : null;
      } else {
        button = proxyTarget;
        code = button.code;
      }

      var btnParams = button ? button.params : null;

      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      switch (code) {
        case 'insert':
          this.insert();
          break;

        case 'insert_actived':
          this.insert().then(function (_ref2) {
            var row = _ref2.row;
            return _this5.setActiveRow(row);
          });
          break;

        case 'mark_cancel':
          this.triggerPendingEvent(code);
          break;

        case 'remove':
          return this.handleDeleteRow(code, 'vxe.grid.removeSelectRecord', function () {
            return _this5.removeCheckboxRow();
          });

        case 'import':
          this.importData(btnParams);
          break;

        case 'open_import':
          this.openImport(btnParams);
          break;

        case 'export':
          this.exportData(btnParams);
          break;

        case 'open_export':
          this.openExport(btnParams);
          break;

        case 'reset_custom':
          this.resetColumn(true);
          break;

        case '_init':
        case 'reload':
        case 'query':
          {
            var ajaxMethods = ajax.query;

            if (ajaxMethods) {
              var isInited = code === '_init';
              var isReload = code === 'reload';
              var sortList = [];
              var filterList = [];
              var pageParams = {};

              if (pagerConfig) {
                if (isInited || isReload) {
                  tablePage.currentPage = 1;
                }

                if ((0, _utils.isEnableConf)(pagerConfig)) {
                  pageParams = _objectSpread({}, tablePage);
                }
              }

              if (isInited) {
                var sortOpts = $xetable.sortOpts;
                var defaultSort = sortOpts.defaultSort; // 如果使用默认排序

                if (defaultSort) {
                  if (!_xeUtils.default.isArray(defaultSort)) {
                    defaultSort = [defaultSort];
                  }

                  sortList = defaultSort.map(function (item) {
                    return {
                      field: item.field,
                      property: item.field,
                      order: item.order
                    };
                  });
                }

                filterList = $xetable.getCheckedFilters();
              } else {
                if (isReload) {
                  this.pendingRecords = [];
                  $xetable.clearAll();
                } else {
                  sortList = $xetable.getSortColumns();
                  filterList = $xetable.getCheckedFilters();
                }
              }

              var params = {
                code: code,
                button: button,
                $grid: this,
                page: pageParams,
                sort: sortList.length ? sortList[0] : {},
                sorts: sortList,
                filters: filterList,
                form: formData,
                options: ajaxMethods
              };
              this.sortData = sortList;
              this.filterData = filterList;
              this.tableLoading = true;
              var applyArgs = [params].concat(args);
              return Promise.resolve((beforeQuery || ajaxMethods).apply(void 0, _toConsumableArray(applyArgs))).catch(function (e) {
                return e;
              }).then(function (rest) {
                _this5.tableLoading = false;

                if (rest) {
                  if ((0, _utils.isEnableConf)(pagerConfig)) {
                    var total = _xeUtils.default.get(rest, proxyProps.total || 'page.total') || 0;
                    tablePage.total = total;
                    _this5.tableData = _xeUtils.default.get(rest, proxyProps.result || 'result') || []; // 检验当前页码，不能超出当前最大页数

                    var pageCount = Math.max(Math.ceil(total / tablePage.pageSize), 1);

                    if (tablePage.currentPage > pageCount) {
                      tablePage.currentPage = pageCount;
                    }
                  } else {
                    _this5.tableData = (proxyProps.list ? _xeUtils.default.get(rest, proxyProps.list) : rest) || [];
                  }
                } else {
                  _this5.tableData = [];
                }

                if (afterQuery) {
                  afterQuery.apply(void 0, _toConsumableArray(applyArgs));
                }
              });
            } else {
              if (process.env.NODE_ENV === 'development') {
                (0, _log.errLog)('vxe.error.notFunc', ['proxy-config.ajax.query']);
              }
            }

            break;
          }

        case 'delete':
          {
            var _ajaxMethods = ajax.delete;

            if (_ajaxMethods) {
              var selectRecords = $xetable.getCheckboxRecords();
              var removeRecords = selectRecords.filter(function (row) {
                return !$xetable.isInsertByRow(row);
              });
              var body = {
                removeRecords: removeRecords
              };

              var _applyArgs = [{
                $grid: this,
                code: code,
                button: button,
                body: body,
                options: _ajaxMethods
              }].concat(args);

              if (selectRecords.length) {
                return this.handleDeleteRow(code, 'vxe.grid.deleteSelectRecord', function () {
                  if (!removeRecords.length) {
                    return $xetable.remove(selectRecords);
                  }

                  _this5.tableLoading = true;
                  return Promise.resolve((beforeDelete || _ajaxMethods).apply(void 0, _toConsumableArray(_applyArgs))).then(function (rest) {
                    _this5.tableLoading = false;
                    _this5.pendingRecords = _this5.pendingRecords.filter(function (row) {
                      return removeRecords.indexOf(row) === -1;
                    });

                    if (isMsg) {
                      // 检测弹窗模块
                      if (process.env.NODE_ENV === 'development') {
                        if (!_vXETable.default.modal) {
                          (0, _log.errLog)('vxe.error.reqModule', ['Modal']);
                        }
                      }

                      _vXETable.default.modal.message({
                        content: _this5.getRespMsg(rest, 'vxe.grid.delSuccess'),
                        status: 'success'
                      });
                    }

                    if (afterDelete) {
                      afterDelete.apply(void 0, _toConsumableArray(_applyArgs));
                    } else {
                      _this5.commitProxy('query');
                    }
                  }).catch(function (rest) {
                    _this5.tableLoading = false;

                    if (isMsg) {
                      // 检测弹窗模块
                      if (process.env.NODE_ENV === 'development') {
                        if (!_vXETable.default.modal) {
                          (0, _log.errLog)('vxe.error.reqModule', ['Modal']);
                        }
                      }

                      _vXETable.default.modal.message({
                        id: code,
                        content: _this5.getRespMsg(rest, 'vxe.grid.operError'),
                        status: 'error'
                      });
                    }
                  });
                });
              } else {
                if (isMsg) {
                  // 检测弹窗模块
                  if (process.env.NODE_ENV === 'development') {
                    if (!_vXETable.default.modal) {
                      (0, _log.errLog)('vxe.error.reqModule', ['Modal']);
                    }
                  }

                  _vXETable.default.modal.message({
                    id: code,
                    content: _conf.default.i18n('vxe.grid.selectOneRecord'),
                    status: 'warning'
                  });
                }
              }
            } else {
              if (process.env.NODE_ENV === 'development') {
                (0, _log.errLog)('vxe.error.notFunc', ['proxy-config.ajax.delete']);
              }
            }

            break;
          }

        case 'save':
          {
            var _ajaxMethods2 = ajax.save;

            if (_ajaxMethods2) {
              var _body = Object.assign({
                pendingRecords: this.pendingRecords
              }, this.getRecordset());

              var insertRecords = _body.insertRecords,
                  _removeRecords = _body.removeRecords,
                  updateRecords = _body.updateRecords,
                  pendingRecords = _body.pendingRecords;

              var _applyArgs2 = [{
                $grid: this,
                code: code,
                button: button,
                body: _body,
                options: _ajaxMethods2
              }].concat(args); // 排除掉新增且标记为删除的数据


              if (insertRecords.length) {
                _body.pendingRecords = pendingRecords.filter(function (row) {
                  return insertRecords.indexOf(row) === -1;
                });
              } // 排除已标记为删除的数据


              if (pendingRecords.length) {
                _body.insertRecords = insertRecords.filter(function (row) {
                  return pendingRecords.indexOf(row) === -1;
                });
              }

              var restPromise = Promise.resolve();

              if (editRules) {
                // 只校验新增和修改的数据
                restPromise = this.validate(_body.insertRecords.concat(updateRecords));
              }

              return restPromise.then(function (errMap) {
                if (errMap) {
                  // 如果校验不通过
                  return;
                }

                if (_body.insertRecords.length || _removeRecords.length || updateRecords.length || _body.pendingRecords.length) {
                  _this5.tableLoading = true;
                  return Promise.resolve((beforeSave || _ajaxMethods2).apply(void 0, _toConsumableArray(_applyArgs2))).then(function (rest) {
                    _this5.tableLoading = false;
                    _this5.pendingRecords = [];

                    if (isMsg) {
                      // 检测弹窗模块
                      if (process.env.NODE_ENV === 'development') {
                        if (!_vXETable.default.modal) {
                          (0, _log.errLog)('vxe.error.reqModule', ['Modal']);
                        }
                      }

                      _vXETable.default.modal.message({
                        content: _this5.getRespMsg(rest, 'vxe.grid.saveSuccess'),
                        status: 'success'
                      });
                    }

                    if (afterSave) {
                      afterSave.apply(void 0, _toConsumableArray(_applyArgs2));
                    } else {
                      _this5.commitProxy('query');
                    }
                  }).catch(function (rest) {
                    _this5.tableLoading = false;

                    if (isMsg) {
                      // 检测弹窗模块
                      if (process.env.NODE_ENV === 'development') {
                        if (!_vXETable.default.modal) {
                          (0, _log.errLog)('vxe.error.reqModule', ['Modal']);
                        }
                      }

                      _vXETable.default.modal.message({
                        id: code,
                        content: _this5.getRespMsg(rest, 'vxe.grid.operError'),
                        status: 'error'
                      });
                    }
                  });
                } else {
                  if (isMsg) {
                    // 检测弹窗模块
                    if (process.env.NODE_ENV === 'development') {
                      if (!_vXETable.default.modal) {
                        (0, _log.errLog)('vxe.error.reqModule', ['Modal']);
                      }
                    }

                    _vXETable.default.modal.message({
                      id: code,
                      content: _conf.default.i18n('vxe.grid.dataUnchanged'),
                      status: 'info'
                    });
                  }
                }
              });
            } else {
              if (process.env.NODE_ENV === 'development') {
                (0, _log.errLog)('vxe.error.notFunc', ['proxy-config.ajax.save']);
              }
            }

            break;
          }

        default:
          {
            var btnMethod = _vXETable.default.commands.get(code);

            if (btnMethod) {
              btnMethod.apply(void 0, [{
                code: code,
                button: button,
                $grid: this,
                $table: $xetable
              }].concat(args));
            }
          }
      }

      return this.$nextTick();
    },
    getRespMsg: function getRespMsg(rest, defaultMsg) {
      var _this$proxyOpts$props = this.proxyOpts.props,
          proxyProps = _this$proxyOpts$props === void 0 ? {} : _this$proxyOpts$props;
      var msg;

      if (rest && proxyProps.message) {
        msg = _xeUtils.default.get(rest, proxyProps.message);
      }

      return msg || _conf.default.i18n(defaultMsg);
    },
    handleDeleteRow: function handleDeleteRow(code, alertKey, callback) {
      var selectRecords = this.getCheckboxRecords();

      if (this.isMsg) {
        if (selectRecords.length) {
          return _vXETable.default.modal.confirm({
            id: "cfm_".concat(code),
            content: _conf.default.i18n(alertKey),
            escClosable: true
          }).then(function (type) {
            if (type === 'confirm') {
              callback();
            }
          });
        } else {
          // 检测弹窗模块
          if (process.env.NODE_ENV === 'development') {
            if (!_vXETable.default.modal) {
              (0, _log.errLog)('vxe.error.reqModule', ['Modal']);
            }
          }

          _vXETable.default.modal.message({
            id: "msg_".concat(code),
            content: _conf.default.i18n('vxe.grid.selectOneRecord'),
            status: 'warning'
          });
        }
      } else {
        if (selectRecords.length) {
          callback();
        }
      }

      return Promise.resolve();
    },
    getFormItems: function getFormItems(itemIndex) {
      var formConfig = this.formConfig,
          formOpts = this.formOpts;
      var itemList = [];

      _xeUtils.default.eachTree((0, _utils.isEnableConf)(formConfig) && formOpts.items ? formOpts.items : [], function (item) {
        itemList.push(item);
      }, {
        children: 'children'
      });

      return _xeUtils.default.isUndefined(itemIndex) ? itemList : itemList[itemIndex];
    },
    getPendingRecords: function getPendingRecords() {
      return this.pendingRecords;
    },
    triggerToolbarBtnEvent: function triggerToolbarBtnEvent(button, evnt) {
      this.commitProxy(button, evnt);
      this.$emit('toolbar-button-click', {
        code: button.code,
        button: button,
        $grid: this,
        $event: evnt
      });
    },
    triggerToolbarTolEvent: function triggerToolbarTolEvent(tool, evnt) {
      this.commitProxy(tool, evnt);
      this.$emit('toolbar-tool-click', {
        code: tool.code,
        tool: tool,
        $grid: this,
        $event: evnt
      });
    },
    triggerPendingEvent: function triggerPendingEvent(code) {
      var pendingRecords = this.pendingRecords,
          isMsg = this.isMsg;
      var selectRecords = this.getCheckboxRecords();

      if (selectRecords.length) {
        var plus = [];
        var minus = [];
        selectRecords.forEach(function (data) {
          if (pendingRecords.some(function (item) {
            return data === item;
          })) {
            minus.push(data);
          } else {
            plus.push(data);
          }
        });

        if (minus.length) {
          this.pendingRecords = pendingRecords.filter(function (item) {
            return minus.indexOf(item) === -1;
          }).concat(plus);
        } else if (plus.length) {
          this.pendingRecords = pendingRecords.concat(plus);
        }

        this.clearCheckboxRow();
      } else {
        if (isMsg) {
          // 检测弹窗模块
          if (process.env.NODE_ENV === 'development') {
            if (!_vXETable.default.modal) {
              (0, _log.errLog)('vxe.error.reqModule', ['Modal']);
            }
          }

          _vXETable.default.modal.message({
            id: code,
            content: _conf.default.i18n('vxe.grid.selectOneRecord'),
            status: 'warning'
          });
        }
      }
    },
    pageChangeEvent: function pageChangeEvent(params) {
      var proxyConfig = this.proxyConfig,
          tablePage = this.tablePage;
      var currentPage = params.currentPage,
          pageSize = params.pageSize;
      tablePage.currentPage = currentPage;
      tablePage.pageSize = pageSize;
      this.$emit('page-change', Object.assign({
        $grid: this
      }, params));

      if (proxyConfig) {
        this.commitProxy('query');
      }
    },
    sortChangeEvent: function sortChangeEvent(params) {
      var $table = params.$table,
          column = params.column,
          sortList = params.sortList;
      var isRemote = _xeUtils.default.isBoolean(column.remoteSort) ? column.remoteSort : $table.sortOpts.remote; // 如果是服务端排序

      if (isRemote) {
        this.sortData = sortList;

        if (this.proxyConfig) {
          this.tablePage.currentPage = 1;
          this.commitProxy('query');
        }
      }

      this.$emit('sort-change', Object.assign({
        $grid: this
      }, params));
    },
    filterChangeEvent: function filterChangeEvent(params) {
      var $table = params.$table,
          filterList = params.filterList; // 如果是服务端过滤

      if ($table.filterOpts.remote) {
        this.filterData = filterList;

        if (this.proxyConfig) {
          this.tablePage.currentPage = 1;
          this.commitProxy('query');
        }
      }

      this.$emit('filter-change', Object.assign({
        $grid: this
      }, params));
    },
    submitEvent: function submitEvent(params) {
      var proxyConfig = this.proxyConfig;

      if (proxyConfig) {
        this.commitProxy('reload');
      }

      this.$emit('form-submit', Object.assign({
        $grid: this
      }, params));
    },
    resetEvent: function resetEvent(params) {
      var proxyConfig = this.proxyConfig;

      if (proxyConfig) {
        this.commitProxy('reload');
      }

      this.$emit('form-reset', Object.assign({
        $grid: this
      }, params));
    },
    submitInvalidEvent: function submitInvalidEvent(params) {
      this.$emit('form-submit-invalid', Object.assign({
        $grid: this
      }, params));
    },
    collapseEvent: function collapseEvent(params) {
      var _this6 = this;

      this.$nextTick(function () {
        return _this6.recalculate(true);
      });
      this.$emit('form-toggle-collapse', Object.assign({
        $grid: this
      }, params));
      this.$emit('form-collapse', Object.assign({
        $grid: this
      }, params));
    },
    triggerZoomEvent: function triggerZoomEvent(evnt) {
      this.zoom();
      this.$emit('zoom', {
        $grid: this,
        type: this.isZMax ? 'max' : 'revert',
        $event: evnt
      });
    },
    zoom: function zoom() {
      return this[this.isZMax ? 'revert' : 'maximize']();
    },
    isMaximized: function isMaximized() {
      return this.isZMax;
    },
    maximize: function maximize() {
      return this.handleZoom(true);
    },
    revert: function revert() {
      return this.handleZoom();
    },
    handleZoom: function handleZoom(isMax) {
      var _this7 = this;

      var isZMax = this.isZMax;

      if (isMax ? !isZMax : isZMax) {
        this.isZMax = !isZMax;

        if (this.tZindex < _utils.default.getLastZIndex()) {
          this.tZindex = _utils.default.nextZIndex();
        }
      }

      return this.$nextTick().then(function () {
        return _this7.recalculate(true);
      }).then(function () {
        return _this7.isZMax;
      });
    },
    getProxyInfo: function getProxyInfo() {
      var sortData = this.sortData,
          proxyConfig = this.proxyConfig;

      if (proxyConfig) {
        return {
          data: this.tableData,
          filter: this.filterData,
          form: this.formData,
          sort: sortData.length ? sortData[0] : {},
          sorts: sortData,
          pager: this.tablePage,
          pendingRecords: this.pendingRecords
        };
      }

      return null;
    }
  }, process.env.NODE_ENV === 'development' ? {
    loadColumn: function loadColumn(columns) {
      var $scopedSlots = this.$scopedSlots;

      _xeUtils.default.eachTree(columns, function (column) {
        if (column.slots) {
          _xeUtils.default.each(column.slots, function (func) {
            if (!_xeUtils.default.isFunction(func)) {
              if (!$scopedSlots[func]) {
                (0, _log.errLog)('vxe.error.notSlot', [func]);
              }
            }
          });
        }
      });

      return this.$refs.xTable.loadColumn(columns);
    },
    reloadColumn: function reloadColumn(columns) {
      this.clearAll();
      return this.loadColumn(columns);
    }
  } : null)
};
exports.default = _default2;