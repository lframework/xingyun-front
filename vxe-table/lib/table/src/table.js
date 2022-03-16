"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _vXETable = _interopRequireDefault(require("../../v-x-e-table"));

var _body = _interopRequireDefault(require("./body"));

var _size = _interopRequireDefault(require("../../mixins/size"));

var _utils = require("../../tools/utils");

var _resize = require("../../tools/resize");

var _event = require("../../tools/event");

var _methods = _interopRequireDefault(require("./methods"));

var _log = require("../../tools/log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * 渲染浮固定列
 * 分别渲染左边固定列和右边固定列
 * 如果宽度足够情况下，则不需要渲染固定列
 * @param {Function} h 创建 VNode 函数
 * @param {Object} $xetable 表格实例
 * @param {String} fixedType 固定列类型
 */
function renderFixed(h, $xetable, fixedType) {
  var _e = $xetable._e,
      tableData = $xetable.tableData,
      tableColumn = $xetable.tableColumn,
      tableGroupColumn = $xetable.tableGroupColumn,
      vSize = $xetable.vSize,
      showHeader = $xetable.showHeader,
      showFooter = $xetable.showFooter,
      columnStore = $xetable.columnStore,
      footerTableData = $xetable.footerTableData;
  var fixedColumn = columnStore["".concat(fixedType, "List")];
  return h('div', {
    class: "vxe-table--fixed-".concat(fixedType, "-wrapper"),
    ref: "".concat(fixedType, "Container")
  }, [showHeader ? h('vxe-table-header', {
    props: {
      fixedType: fixedType,
      tableData: tableData,
      tableColumn: tableColumn,
      tableGroupColumn: tableGroupColumn,
      size: vSize,
      fixedColumn: fixedColumn
    },
    ref: "".concat(fixedType, "Header")
  }) : _e(), h('vxe-table-body', {
    props: {
      fixedType: fixedType,
      tableData: tableData,
      tableColumn: tableColumn,
      fixedColumn: fixedColumn,
      size: vSize
    },
    ref: "".concat(fixedType, "Body")
  }), showFooter ? h('vxe-table-footer', {
    props: {
      footerTableData: footerTableData,
      tableColumn: tableColumn,
      fixedColumn: fixedColumn,
      fixedType: fixedType,
      size: vSize
    },
    ref: "".concat(fixedType, "Footer")
  }) : _e()]);
}

function renderEmptyContenet(h, _vm) {
  var $scopedSlots = _vm.$scopedSlots,
      emptyOpts = _vm.emptyOpts;
  var emptyContent = '';
  var params = {
    $table: _vm
  };

  if ($scopedSlots.empty) {
    emptyContent = $scopedSlots.empty.call(_vm, params, h);
  } else {
    var compConf = emptyOpts.name ? _vXETable.default.renderer.get(emptyOpts.name) : null;
    var renderEmpty = compConf ? compConf.renderEmpty : null;

    if (renderEmpty) {
      emptyContent = renderEmpty.call(_vm, h, emptyOpts, params);
    } else {
      emptyContent = (0, _utils.getFuncText)(_vm.emptyText) || _conf.default.i18n('vxe.table.emptyText');
    }
  }

  return emptyContent;
}

function handleUupdateResize(_vm) {
  var $el = _vm.$el;

  if ($el && $el.clientWidth && $el.clientHeight) {
    _vm.recalculate();
  }
}

var _default2 = {
  name: 'VxeTable',
  mixins: [_size.default],
  props: {
    /** 基本属性 */
    id: String,
    // 数据
    data: Array,
    // 表格的高度
    height: [Number, String],
    // 表格的最大高度
    maxHeight: [Number, String],
    // 已废弃，被 column-config.resizable 替换
    resizable: {
      type: Boolean,
      default: function _default() {
        return _conf.default.table.resizable;
      }
    },
    // 是否带有斑马纹
    stripe: {
      type: Boolean,
      default: function _default() {
        return _conf.default.table.stripe;
      }
    },
    // 是否带有边框
    border: {
      type: [Boolean, String],
      default: function _default() {
        return _conf.default.table.border;
      }
    },
    // 是否圆角边框
    round: {
      type: Boolean,
      default: function _default() {
        return _conf.default.table.round;
      }
    },
    // 表格的尺寸
    size: {
      type: String,
      default: function _default() {
        return _conf.default.table.size || _conf.default.size;
      }
    },
    // 列的宽度是否自撑开（可能会被废弃的参数，不要使用）
    fit: {
      type: Boolean,
      default: function _default() {
        return _conf.default.table.fit;
      }
    },
    // 表格是否加载中
    loading: Boolean,
    // 所有的列对其方式
    align: {
      type: String,
      default: function _default() {
        return _conf.default.table.align;
      }
    },
    // 所有的表头列的对齐方式
    headerAlign: {
      type: String,
      default: function _default() {
        return _conf.default.table.headerAlign;
      }
    },
    // 所有的表尾列的对齐方式
    footerAlign: {
      type: String,
      default: function _default() {
        return _conf.default.table.footerAlign;
      }
    },
    // 是否显示表头
    showHeader: {
      type: Boolean,
      default: function _default() {
        return _conf.default.table.showHeader;
      }
    },
    // 已废弃，被 row-config.isCurrent 替换
    highlightCurrentRow: {
      type: Boolean,
      default: function _default() {
        return _conf.default.table.highlightCurrentRow;
      }
    },
    // 已废弃，被 row-config.isHover 替换
    highlightHoverRow: {
      type: Boolean,
      default: function _default() {
        return _conf.default.table.highlightHoverRow;
      }
    },
    // 已废弃，被 column-config.isCurrent 替换
    highlightCurrentColumn: {
      type: Boolean,
      default: function _default() {
        return _conf.default.table.highlightCurrentColumn;
      }
    },
    // 已废弃，被 column-config.isHover 替换
    highlightHoverColumn: {
      type: Boolean,
      default: function _default() {
        return _conf.default.table.highlightHoverColumn;
      }
    },
    // 已废弃，直接删除
    highlightCell: Boolean,
    // 是否显示表尾合计
    showFooter: Boolean,
    // 表尾合计的计算方法
    footerMethod: Function,
    // 给行附加 className
    rowClassName: [String, Function],
    // 给单元格附加 className
    cellClassName: [String, Function],
    // 给表头的行附加 className
    headerRowClassName: [String, Function],
    // 给表头的单元格附加 className
    headerCellClassName: [String, Function],
    // 给表尾的行附加 className
    footerRowClassName: [String, Function],
    // 给表尾的单元格附加 className
    footerCellClassName: [String, Function],
    // 给单元格附加样式
    cellStyle: [Object, Function],
    // 给表头单元格附加样式
    headerCellStyle: [Object, Function],
    // 给表尾单元格附加样式
    footerCellStyle: [Object, Function],
    // 给行附加样式
    rowStyle: [Object, Function],
    // 给表头行附加样式
    headerRowStyle: [Object, Function],
    // 给表尾行附加样式
    footerRowStyle: [Object, Function],
    // 合并指定单元格
    mergeCells: Array,
    // 合并指定的表尾
    mergeFooterItems: Array,
    // 自定义合并行或列的方法
    spanMethod: Function,
    // 表尾合并行或列
    footerSpanMethod: Function,
    // 设置所有内容过长时显示为省略号
    showOverflow: {
      type: [Boolean, String],
      default: function _default() {
        return _conf.default.table.showOverflow;
      }
    },
    // 设置表头所有内容过长时显示为省略号
    showHeaderOverflow: {
      type: [Boolean, String],
      default: function _default() {
        return _conf.default.table.showHeaderOverflow;
      }
    },
    // 设置表尾所有内容过长时显示为省略号
    showFooterOverflow: {
      type: [Boolean, String],
      default: function _default() {
        return _conf.default.table.showFooterOverflow;
      }
    },

    /** 高级属性 */
    // （即将废弃）columnKey 已废弃，被 column-config.useKey 替换
    columnKey: Boolean,
    // （即将废弃）rowKey 已废弃，被 row-config.useKey 替换
    rowKey: Boolean,
    // （即将废弃）rowId 已废弃，被 row-config.keyField 替换
    rowId: {
      type: String,
      default: function _default() {
        return _conf.default.table.rowId;
      }
    },
    zIndex: Number,
    emptyText: {
      type: String,
      default: function _default() {
        return _conf.default.table.emptyText;
      }
    },
    keepSource: {
      type: Boolean,
      default: function _default() {
        return _conf.default.table.keepSource;
      }
    },
    // 是否自动监听父容器变化去更新响应式表格宽高
    autoResize: {
      type: Boolean,
      default: function _default() {
        return _conf.default.table.autoResize;
      }
    },
    // 是否自动根据状态属性去更新响应式表格宽高
    syncResize: [Boolean, String, Number],
    // 列配置信息
    columnConfig: Object,
    // 行配置信息
    rowConfig: Object,
    // 列调整配置项
    resizableConfig: Object,
    // 序号配置项
    seqConfig: Object,
    // 排序配置项
    sortConfig: Object,
    // 筛选配置项
    filterConfig: Object,
    // 单选框配置
    radioConfig: Object,
    // 复选框配置项
    checkboxConfig: Object,
    // tooltip 配置项
    tooltipConfig: Object,
    // 导出配置项
    exportConfig: [Boolean, Object],
    // 导入配置项
    importConfig: [Boolean, Object],
    // 打印配置项
    printConfig: Object,
    // 展开行配置项
    expandConfig: Object,
    // 树形结构配置项
    treeConfig: [Boolean, Object],
    // 快捷菜单配置项
    menuConfig: [Boolean, Object],
    // 在 v4 中废弃 contextMenu
    contextMenu: [Boolean, Object],
    // 鼠标配置项
    mouseConfig: Object,
    // 区域配置项
    areaConfig: Object,
    // 按键配置项
    keyboardConfig: Object,
    // 复制/粘贴配置项
    clipConfig: Object,
    // 查找/替换配置项
    fnrConfig: Object,
    // 编辑配置项
    editConfig: [Boolean, Object],
    // 校验配置项
    validConfig: Object,
    // 校验规则配置项
    editRules: Object,
    // 空内容渲染配置项
    emptyRender: [Boolean, Object],
    // 自定义列配置项
    customConfig: [Boolean, Object],
    // 横向虚拟滚动配置项
    scrollX: Object,
    // 纵向虚拟滚动配置项
    scrollY: Object,
    // （即将废弃）优化相关
    animat: {
      type: Boolean,
      default: function _default() {
        return _conf.default.table.animat;
      }
    },
    // （可能会被废弃的参数，不要使用）
    delayHover: {
      type: Number,
      default: function _default() {
        return _conf.default.table.delayHover;
      }
    },
    // 额外的参数
    params: Object
  },
  components: {
    VxeTableBody: _body.default
  },
  provide: function provide() {
    return {
      $xetable: this,
      xecolgroup: null
    };
  },
  inject: {
    $xegrid: {
      default: null
    }
  },
  data: function data() {
    return {
      tId: "".concat(_xeUtils.default.uniqueId()),
      // 低性能的静态列
      staticColumns: [],
      // 渲染的列分组
      tableGroupColumn: [],
      // 可视区渲染的列
      tableColumn: [],
      // 渲染中的数据
      tableData: [],
      // 是否启用了横向 X 可视渲染方式加载
      scrollXLoad: false,
      // 是否启用了纵向 Y 可视渲染方式加载
      scrollYLoad: false,
      // 是否存在纵向滚动条
      overflowY: true,
      // 是否存在横向滚动条
      overflowX: false,
      // 纵向滚动条的宽度
      scrollbarWidth: 0,
      // 横向滚动条的高度
      scrollbarHeight: 0,
      // 行高
      rowHeight: 0,
      // 表格父容器的高度
      parentHeight: 0,
      // 是否使用分组表头
      isGroup: false,
      isAllOverflow: false,
      // 复选框属性，是否全选
      isAllSelected: false,
      // 复选框属性，有选中且非全选状态
      isIndeterminate: false,
      // 复选框属性，已选中的行
      selection: [],
      // 当前行
      currentRow: null,
      // 单选框属性，选中列
      currentColumn: null,
      // 单选框属性，选中行
      selectRow: null,
      // 表尾合计数据
      footerTableData: [],
      // 展开列信息
      expandColumn: null,
      hasFixedColumn: false,
      // 树节点列信息
      treeNodeColumn: null,
      // 已展开的行
      rowExpandeds: [],
      // 懒加载中的展开行的列表
      expandLazyLoadeds: [],
      // 已展开树节点
      treeExpandeds: [],
      // 懒加载中的树节点的列表
      treeLazyLoadeds: [],
      // 树节点不确定状态的列表
      treeIndeterminates: [],
      // 合并单元格的对象集
      mergeList: [],
      // 合并表尾数据的对象集
      mergeFooterList: [],
      // 初始化标识
      initStore: {
        filter: false,
        import: false,
        export: false
      },
      // 当前选中的筛选列
      filterStore: {
        isAllSelected: false,
        isIndeterminate: false,
        style: null,
        options: [],
        column: null,
        multiple: false,
        visible: false,
        maxHeight: null
      },
      // 存放列相关的信息
      columnStore: {
        leftList: [],
        centerList: [],
        rightList: [],
        resizeList: [],
        pxList: [],
        pxMinList: [],
        scaleList: [],
        scaleMinList: [],
        autoList: []
      },
      // 存放快捷菜单的信息
      ctxMenuStore: {
        selected: null,
        visible: false,
        showChild: false,
        selectChild: null,
        list: [],
        style: null
      },
      // 存放可编辑相关信息
      editStore: {
        indexs: {
          columns: []
        },
        titles: {
          columns: []
        },
        // 选中源
        selected: {
          row: null,
          column: null
        },
        // 已复制源
        copyed: {
          cut: false,
          rows: [],
          columns: []
        },
        // 激活
        actived: {
          row: null,
          column: null
        },
        insertList: [],
        removeList: []
      },
      // 存放 tooltip 相关信息
      tooltipStore: {
        row: null,
        column: null,
        visible: false,
        currOpts: null
      },
      // 存放数据校验相关信息
      validStore: {
        visible: false,
        row: null,
        column: null,
        content: '',
        rule: null,
        isArrow: false
      },
      // 导入相关信息
      importStore: {
        inited: false,
        file: null,
        type: '',
        modeList: [],
        typeList: [],
        filename: '',
        visible: false
      },
      importParams: {
        mode: '',
        types: null,
        message: true
      },
      // 导出相关信息
      exportStore: {
        inited: false,
        name: '',
        modeList: [],
        typeList: [],
        columns: [],
        isPrint: false,
        hasFooter: false,
        hasTree: false,
        hasMerge: false,
        hasColgroup: false,
        visible: false
      },
      exportParams: {
        filename: '',
        sheetName: '',
        mode: '',
        type: '',
        isColgroup: false,
        isMerge: false,
        isAllExpand: false,
        useStyle: false,
        original: false,
        message: true,
        isHeader: false,
        isFooter: false
      }
    };
  },
  computed: {
    validOpts: function validOpts() {
      return Object.assign({
        message: 'default'
      }, _conf.default.table.validConfig, this.validConfig);
    },
    sXOpts: function sXOpts() {
      return Object.assign({}, _conf.default.table.scrollX, this.scrollX);
    },
    sYOpts: function sYOpts() {
      return Object.assign({}, _conf.default.table.scrollY, this.scrollY);
    },
    rowHeightMaps: function rowHeightMaps() {
      return {
        default: 48,
        medium: 44,
        small: 40,
        mini: 36
      };
    },
    columnOpts: function columnOpts() {
      return Object.assign({}, _conf.default.table.columnConfig, this.columnConfig);
    },
    rowOpts: function rowOpts() {
      return Object.assign({}, _conf.default.table.rowConfig, this.rowConfig);
    },
    resizableOpts: function resizableOpts() {
      return Object.assign({}, _conf.default.table.resizableConfig, this.resizableConfig);
    },
    seqOpts: function seqOpts() {
      return Object.assign({
        startIndex: 0
      }, _conf.default.table.seqConfig, this.seqConfig);
    },
    radioOpts: function radioOpts() {
      return Object.assign({}, _conf.default.table.radioConfig, this.radioConfig);
    },
    checkboxOpts: function checkboxOpts() {
      return Object.assign({}, _conf.default.table.checkboxConfig, this.checkboxConfig);
    },
    tooltipOpts: function tooltipOpts() {
      return Object.assign({}, _conf.default.tooltip, _conf.default.table.tooltipConfig, this.tooltipConfig);
    },
    tipConfig: function tipConfig() {
      return _objectSpread(_objectSpread({}, this.tooltipOpts), this.tooltipStore.currOpts);
    },
    validTipOpts: function validTipOpts() {
      return Object.assign({
        isArrow: false
      }, this.tooltipOpts);
    },
    editOpts: function editOpts() {
      return Object.assign({}, _conf.default.table.editConfig, this.editConfig);
    },
    sortOpts: function sortOpts() {
      return Object.assign({
        orders: ['asc', 'desc', null]
      }, _conf.default.table.sortConfig, this.sortConfig);
    },
    filterOpts: function filterOpts() {
      return Object.assign({}, _conf.default.table.filterConfig, this.filterConfig);
    },
    mouseOpts: function mouseOpts() {
      return Object.assign({}, _conf.default.table.mouseConfig, this.mouseConfig);
    },
    areaOpts: function areaOpts() {
      return Object.assign({}, _conf.default.table.areaConfig, this.areaConfig);
    },
    keyboardOpts: function keyboardOpts() {
      return Object.assign({}, _conf.default.table.keyboardConfig, this.keyboardConfig);
    },
    clipOpts: function clipOpts() {
      return Object.assign({}, _conf.default.table.clipConfig, this.clipConfig);
    },
    fnrOpts: function fnrOpts() {
      return Object.assign({}, _conf.default.table.fnrConfig, this.fnrConfig);
    },
    hasTip: function hasTip() {
      return _vXETable.default._tooltip;
    },
    headerCtxMenu: function headerCtxMenu() {
      var headerOpts = this.ctxMenuOpts.header;
      return headerOpts && headerOpts.options ? headerOpts.options : [];
    },
    bodyCtxMenu: function bodyCtxMenu() {
      var bodyOpts = this.ctxMenuOpts.body;
      return bodyOpts && bodyOpts.options ? bodyOpts.options : [];
    },
    footerCtxMenu: function footerCtxMenu() {
      var footerOpts = this.ctxMenuOpts.footer;
      return footerOpts && footerOpts.options ? footerOpts.options : [];
    },
    isCtxMenu: function isCtxMenu() {
      return !!((this.contextMenu || this.menuConfig) && (0, _utils.isEnableConf)(this.ctxMenuOpts) && (this.headerCtxMenu.length || this.bodyCtxMenu.length || this.footerCtxMenu.length));
    },
    ctxMenuOpts: function ctxMenuOpts() {
      return Object.assign({}, _conf.default.table.menuConfig, this.contextMenu, this.menuConfig);
    },
    ctxMenuList: function ctxMenuList() {
      var rest = [];
      this.ctxMenuStore.list.forEach(function (list) {
        list.forEach(function (item) {
          rest.push(item);
        });
      });
      return rest;
    },
    exportOpts: function exportOpts() {
      return Object.assign({}, _conf.default.table.exportConfig, this.exportConfig);
    },
    importOpts: function importOpts() {
      return Object.assign({}, _conf.default.table.importConfig, this.importConfig);
    },
    printOpts: function printOpts() {
      return Object.assign({}, _conf.default.table.printConfig, this.printConfig);
    },
    expandOpts: function expandOpts() {
      return Object.assign({}, _conf.default.table.expandConfig, this.expandConfig);
    },
    treeOpts: function treeOpts() {
      return Object.assign({}, _conf.default.table.treeConfig, this.treeConfig);
    },
    emptyOpts: function emptyOpts() {
      return Object.assign({}, _conf.default.table.emptyRender, this.emptyRender);
    },
    cellOffsetWidth: function cellOffsetWidth() {
      return this.border ? Math.max(2, Math.ceil(this.scrollbarWidth / this.tableColumn.length)) : 1;
    },
    customOpts: function customOpts() {
      return Object.assign({}, _conf.default.table.customConfig, this.customConfig);
    },
    tableBorder: function tableBorder() {
      var border = this.border;

      if (border === true) {
        return 'full';
      }

      if (border) {
        return border;
      }

      return 'default';
    },

    /**
     * 判断列全选的复选框是否禁用
     */
    isAllCheckboxDisabled: function isAllCheckboxDisabled() {
      var tableFullData = this.tableFullData,
          tableData = this.tableData,
          treeConfig = this.treeConfig,
          checkboxOpts = this.checkboxOpts;
      var strict = checkboxOpts.strict,
          checkMethod = checkboxOpts.checkMethod;

      if (strict) {
        if (tableData.length || tableFullData.length) {
          if (checkMethod) {
            if (treeConfig) {// 暂时不支持树形结构
            } // 如果所有行都被禁用


            return tableFullData.every(function (row) {
              return !checkMethod({
                row: row
              });
            });
          }

          return false;
        }

        return true;
      }

      return false;
    }
  },
  watch: {
    data: function data(value) {
      var _this = this;

      var inited = this.inited,
          initStatus = this.initStatus;
      this.loadTableData(value).then(function () {
        _this.inited = true;
        _this.initStatus = true;

        if (!initStatus) {
          _this.handleLoadDefaults();
        }

        if (!inited) {
          _this.handleInitDefaults();
        }

        if ((_this.scrollXLoad || _this.scrollYLoad) && _this.expandColumn) {
          (0, _log.warnLog)('vxe.error.scrollErrProp', ['column.type=expand']);
        }

        _this.recalculate();
      });
    },
    staticColumns: function staticColumns(value) {
      this.handleColumn(value);
    },
    tableColumn: function tableColumn() {
      this.analyColumnWidth();
    },
    showHeader: function showHeader() {
      var _this2 = this;

      this.$nextTick(function () {
        _this2.recalculate(true).then(function () {
          return _this2.refreshScroll();
        });
      });
    },
    showFooter: function showFooter() {
      var _this3 = this;

      this.$nextTick(function () {
        _this3.recalculate(true).then(function () {
          return _this3.refreshScroll();
        });
      });
    },
    height: function height() {
      var _this4 = this;

      this.$nextTick(function () {
        return _this4.recalculate(true);
      });
    },
    maxHeight: function maxHeight() {
      var _this5 = this;

      this.$nextTick(function () {
        return _this5.recalculate(true);
      });
    },
    syncResize: function syncResize(value) {
      var _this6 = this;

      if (value) {
        handleUupdateResize(this);
        this.$nextTick(function () {
          handleUupdateResize(_this6);
          setTimeout(function () {
            return handleUupdateResize(_this6);
          });
        });
      }
    },
    mergeCells: function mergeCells(value) {
      var _this7 = this;

      this.clearMergeCells();
      this.$nextTick(function () {
        return _this7.setMergeCells(value);
      });
    },
    mergeFooterItems: function mergeFooterItems(value) {
      var _this8 = this;

      this.clearMergeFooterItems();
      this.$nextTick(function () {
        return _this8.setMergeFooterItems(value);
      });
    }
  },
  created: function created() {
    var _this9 = this;

    var _Object$assign = Object.assign(this, {
      tZindex: 0,
      elemStore: {},
      // 存放横向 X 虚拟滚动相关的信息
      scrollXStore: {},
      // 存放纵向 Y 虚拟滚动相关信息
      scrollYStore: {},
      // 表格宽度
      tableWidth: 0,
      // 表格高度
      tableHeight: 0,
      // 表头高度
      headerHeight: 0,
      // 表尾高度
      footerHeight: 0,
      // 当前 hover 行
      // hoverRow: null,
      // 最后滚动位置
      lastScrollLeft: 0,
      lastScrollTop: 0,
      // 单选框属性，已选中保留的行
      radioReserveRow: null,
      // 复选框属性，已选中保留的行
      checkboxReserveRowMap: {},
      // 行数据，已展开保留的行
      rowExpandedReserveRowMap: {},
      // 树结构数据，已展开保留的行
      treeExpandedReserveRowMap: {},
      // 完整数据、条件处理后
      tableFullData: [],
      afterFullData: [],
      // 收集的列配置（带分组）
      collectColumn: [],
      // 完整所有列（不带分组）
      tableFullColumn: [],
      // 渲染所有列
      visibleColumn: [],
      // 缓存数据集
      fullAllDataRowMap: new Map(),
      fullAllDataRowIdData: {},
      fullDataRowMap: new Map(),
      fullDataRowIdData: {},
      fullColumnMap: new Map(),
      fullColumnIdData: {},
      fullColumnFieldData: {}
    }),
        scrollXStore = _Object$assign.scrollXStore,
        sYOpts = _Object$assign.sYOpts,
        scrollYStore = _Object$assign.scrollYStore,
        data = _Object$assign.data,
        editOpts = _Object$assign.editOpts,
        treeOpts = _Object$assign.treeOpts,
        treeConfig = _Object$assign.treeConfig,
        showOverflow = _Object$assign.showOverflow,
        rowOpts = _Object$assign.rowOpts;

    if (process.env.NODE_ENV === 'development') {
      // if (this.rowId) {
      //   warnLog('vxe.error.delProp', ['row-id', 'row-config.keyField'])
      // }
      // if (this.rowKey) {
      //   warnLog('vxe.error.delProp', ['row-id', 'row-config.useKey'])
      // }
      // if (this.columnKey) {
      //   warnLog('vxe.error.delProp', ['row-id', 'column-config.useKey'])
      // }
      if (!(this.rowId || rowOpts.keyField) && (this.checkboxOpts.reserve || this.checkboxOpts.checkRowKeys || this.radioOpts.reserve || this.radioOpts.checkRowKey || this.expandOpts.expandRowKeys || this.treeOpts.expandRowKeys)) {
        (0, _log.warnLog)('vxe.error.reqProp', ['row-config.keyField']);
      }

      if (this.editConfig && editOpts.showStatus && !this.keepSource) {
        (0, _log.warnLog)('vxe.error.reqProp', ['keep-source']);
      }

      if (treeConfig && treeOpts.line && (!(this.rowKey || rowOpts.useKey) || !showOverflow)) {
        (0, _log.warnLog)('vxe.error.reqProp', ['row-config.useKey | show-overflow']);
      }

      if (this.showFooter && !this.footerMethod) {
        (0, _log.warnLog)('vxe.error.reqProp', ['footer-method']);
      }

      if (treeConfig && this.stripe) {
        (0, _log.warnLog)('vxe.error.noTree', ['stripe']);
      }

      if (this.tooltipOpts.enabled) {
        (0, _log.warnLog)('vxe.error.delProp', ['tooltip-config.enabled', 'tooltip-config.showAll']);
      } // if (this.highlightCurrentRow) {
      //   warnLog('vxe.error.delProp', ['highlight-current-row', 'row-config.isCurrent'])
      // }
      // if (this.highlightHoverRow) {
      //   warnLog('vxe.error.delProp', ['highlight-hover-row', 'row-config.isHover'])
      // }
      // if (this.highlightCurrentColumn) {
      //   warnLog('vxe.error.delProp', ['highlight-current-column', 'column-config.isCurrent'])
      // }
      // if (this.highlightHoverColumn) {
      //   warnLog('vxe.error.delProp', ['highlight-hover-column', 'column-config.isHover'])
      // }
      // 检查导入导出类型，如果自定义导入导出方法，则不校验类型


      var exportConfig = this.exportConfig,
          exportOpts = this.exportOpts,
          importConfig = this.importConfig,
          importOpts = this.importOpts;

      if (importConfig && importOpts.types && !importOpts.importMethod && !_xeUtils.default.includeArrays(_vXETable.default.config.importTypes, importOpts.types)) {
        (0, _log.warnLog)('vxe.error.errProp', ["export-config.types=".concat(importOpts.types.join(',')), importOpts.types.filter(function (type) {
          return _xeUtils.default.includes(_vXETable.default.config.importTypes, type);
        }).join(',') || _vXETable.default.config.importTypes.join(',')]);
      }

      if (exportConfig && exportOpts.types && !exportOpts.exportMethod && !_xeUtils.default.includeArrays(_vXETable.default.config.exportTypes, exportOpts.types)) {
        (0, _log.warnLog)('vxe.error.errProp', ["export-config.types=".concat(exportOpts.types.join(',')), exportOpts.types.filter(function (type) {
          return _xeUtils.default.includes(_vXETable.default.config.exportTypes, type);
        }).join(',') || _vXETable.default.config.exportTypes.join(',')]);
      }
    }

    if (process.env.NODE_ENV === 'development') {
      var customOpts = this.customOpts;

      if (!this.id && this.customConfig && (customOpts.storage === true || customOpts.storage && customOpts.storage.resizable || customOpts.storage && customOpts.storage.visible)) {
        (0, _log.errLog)('vxe.error.reqProp', ['id']);
      }

      if (this.treeConfig && this.checkboxOpts.range) {
        (0, _log.errLog)('vxe.error.noTree', ['checkbox-config.range']);
      }

      if (this.rowOpts.height && !this.showOverflow) {
        (0, _log.warnLog)('vxe.error.notProp', ['table.show-overflow']);
      }

      if (!this.handleUpdateCellAreas) {
        if (this.clipConfig) {
          (0, _log.warnLog)('vxe.error.notProp', ['clip-config']);
        }

        if (this.fnrConfig) {
          (0, _log.warnLog)('vxe.error.notProp', ['fnr-config']);
        }

        if (this.mouseOpts.area) {
          (0, _log.errLog)('vxe.error.notProp', ['mouse-config.area']);
          return;
        }
      }

      if (this.mouseOpts.area && this.mouseOpts.selected) {
        (0, _log.warnLog)('vxe.error.errConflicts', ['mouse-config.area', 'mouse-config.selected']);
      }

      if (this.mouseOpts.area && this.checkboxOpts.range) {
        (0, _log.warnLog)('vxe.error.errConflicts', ['mouse-config.area', 'checkbox-config.range']);
      }

      if (this.treeConfig && this.mouseOpts.area) {
        (0, _log.errLog)('vxe.error.noTree', ['mouse-config.area']);
      }
    } // v4 中只支持对象类型


    if (process.env.NODE_ENV === 'development') {
      // 在 v3.0 中废弃 context-menu
      if (this.contextMenu) {
        (0, _log.warnLog)('vxe.error.delProp', ['context-menu', 'menu-config']);

        if (!_xeUtils.default.isObject(this.contextMenu)) {
          (0, _log.warnLog)('vxe.error.errProp', ["table.context-menu=".concat(this.contextMenu), 'table.context-menu={}']);
        }
      }

      if (this.menuConfig && !_xeUtils.default.isObject(this.menuConfig)) {
        (0, _log.warnLog)('vxe.error.errProp', ["table.menu-config=".concat(this.menuConfig), 'table.menu-config={}']);
      }

      if (this.exportConfig && !_xeUtils.default.isObject(this.exportConfig)) {
        (0, _log.warnLog)('vxe.error.errProp', ["table.export-config=".concat(this.exportConfig), 'table.export-config={}']);
      }

      if (this.importConfig && !_xeUtils.default.isObject(this.importConfig)) {
        (0, _log.warnLog)('vxe.error.errProp', ["table.import-config=".concat(this.importConfig), 'table.import-config={}']);
      }

      if (this.printConfig && !_xeUtils.default.isObject(this.printConfig)) {
        (0, _log.warnLog)('vxe.error.errProp', ["table.print-config=".concat(this.printConfig), 'table.print-config={}']);
      }

      if (this.treeConfig && !_xeUtils.default.isObject(this.treeConfig)) {
        (0, _log.warnLog)('vxe.error.errProp', ["table.tree-config=".concat(this.treeConfig), 'table.tree-config={}']);
      }

      if (this.customConfig && !_xeUtils.default.isObject(this.customConfig)) {
        (0, _log.warnLog)('vxe.error.errProp', ["table.custom-config=".concat(this.customConfig), 'table.custom-config={}']);
      }

      if (this.editConfig && !_xeUtils.default.isObject(this.editConfig)) {
        (0, _log.warnLog)('vxe.error.errProp', ["table.edit-config=".concat(this.editConfig), 'table.edit-config={}']);
      }

      if (this.emptyRender && !_xeUtils.default.isObject(this.emptyRender)) {
        (0, _log.warnLog)('vxe.error.errProp', ["table.empty-render=".concat(this.emptyRender), 'table.empty-render={}']);
      }
    } // 检查是否有安装需要的模块


    if (process.env.NODE_ENV === 'development') {
      if (this.editConfig && !this._insert) {
        (0, _log.errLog)('vxe.error.reqModule', ['Edit']);
      }

      if (this.editRules && !this._validate) {
        (0, _log.errLog)('vxe.error.reqModule', ['Validator']);
      }

      if ((this.checkboxOpts.range || this.keyboardConfig || this.mouseConfig) && !this.triggerCellMousedownEvent) {
        (0, _log.errLog)('vxe.error.reqModule', ['Keyboard']);
      }

      if ((this.printConfig || this.importConfig || this.exportConfig) && !this._exportData) {
        (0, _log.errLog)('vxe.error.reqModule', ['Export']);
      }
    }

    Object.assign(scrollYStore, {
      startIndex: 0,
      endIndex: 1,
      visibleSize: 0,
      adaptive: sYOpts.adaptive !== false
    });
    Object.assign(scrollXStore, {
      startIndex: 0,
      endIndex: 1,
      visibleSize: 0
    });
    this.loadTableData(data).then(function () {
      if (data && data.length) {
        _this9.inited = true;
        _this9.initStatus = true;

        _this9.handleLoadDefaults();

        _this9.handleInitDefaults();
      }

      _this9.updateStyle();
    });

    _event.GlobalEvent.on(this, 'paste', this.handleGlobalPasteEvent);

    _event.GlobalEvent.on(this, 'copy', this.handleGlobalCopyEvent);

    _event.GlobalEvent.on(this, 'cut', this.handleGlobalCutEvent);

    _event.GlobalEvent.on(this, 'mousedown', this.handleGlobalMousedownEvent);

    _event.GlobalEvent.on(this, 'blur', this.handleGlobalBlurEvent);

    _event.GlobalEvent.on(this, 'mousewheel', this.handleGlobalMousewheelEvent);

    _event.GlobalEvent.on(this, 'keydown', this.handleGlobalKeydownEvent);

    _event.GlobalEvent.on(this, 'resize', this.handleGlobalResizeEvent);

    _event.GlobalEvent.on(this, 'contextmenu', this.handleGlobalContextmenuEvent);

    this.preventEvent(null, 'created');
  },
  mounted: function mounted() {
    var _this10 = this;

    if (process.env.NODE_ENV === 'development') {
      var $listeners = this.$listeners;

      if (!this.menuConfig && ($listeners['menu-click'] || $listeners['cell-menu'] || $listeners['header-cell-menu'] || $listeners['footer-cell-menu'])) {
        (0, _log.warnLog)('vxe.error.reqProp', ['menu-config']);
      }

      if (!this.tooltipConfig && ($listeners['cell-mouseenter'] || $listeners['cell-mouseleave'])) {
        (0, _log.warnLog)('vxe.error.reqProp', ['tooltip-config']);
      }
    }

    if (this.autoResize) {
      var resizeObserver = (0, _resize.createResizeEvent)(function () {
        return _this10.recalculate(true);
      });
      resizeObserver.observe(this.$el);
      resizeObserver.observe(this.getParentElem());
      this.$resize = resizeObserver;
    }

    this.preventEvent(null, 'mounted');
  },
  activated: function activated() {
    var _this11 = this;

    this.recalculate().then(function () {
      return _this11.refreshScroll();
    });
    this.preventEvent(null, 'activated');
  },
  deactivated: function deactivated() {
    this.preventEvent(null, 'deactivated');
  },
  beforeDestroy: function beforeDestroy() {
    if (this.$resize) {
      this.$resize.disconnect();
    }

    this.closeFilter();
    this.closeMenu();
    this.preventEvent(null, 'beforeDestroy');
  },
  destroyed: function destroyed() {
    _event.GlobalEvent.off(this, 'paste');

    _event.GlobalEvent.off(this, 'copy');

    _event.GlobalEvent.off(this, 'cut');

    _event.GlobalEvent.off(this, 'mousedown');

    _event.GlobalEvent.off(this, 'blur');

    _event.GlobalEvent.off(this, 'mousewheel');

    _event.GlobalEvent.off(this, 'keydown');

    _event.GlobalEvent.off(this, 'resize');

    _event.GlobalEvent.off(this, 'contextmenu');

    this.preventEvent(null, 'destroyed');
  },
  render: function render(h) {
    var _e = this._e,
        tId = this.tId,
        tableData = this.tableData,
        tableColumn = this.tableColumn,
        tableGroupColumn = this.tableGroupColumn,
        isGroup = this.isGroup,
        loading = this.loading,
        stripe = this.stripe,
        showHeader = this.showHeader,
        height = this.height,
        tableBorder = this.tableBorder,
        treeOpts = this.treeOpts,
        treeConfig = this.treeConfig,
        mouseConfig = this.mouseConfig,
        mouseOpts = this.mouseOpts,
        vSize = this.vSize,
        validOpts = this.validOpts,
        showFooter = this.showFooter,
        overflowX = this.overflowX,
        overflowY = this.overflowY,
        scrollXLoad = this.scrollXLoad,
        scrollYLoad = this.scrollYLoad,
        scrollbarHeight = this.scrollbarHeight,
        highlightCell = this.highlightCell,
        highlightHoverRow = this.highlightHoverRow,
        highlightHoverColumn = this.highlightHoverColumn,
        editConfig = this.editConfig,
        validTipOpts = this.validTipOpts,
        initStore = this.initStore,
        columnStore = this.columnStore,
        filterStore = this.filterStore,
        ctxMenuStore = this.ctxMenuStore,
        ctxMenuOpts = this.ctxMenuOpts,
        footerTableData = this.footerTableData,
        hasTip = this.hasTip,
        columnOpts = this.columnOpts,
        rowOpts = this.rowOpts;
    var leftList = columnStore.leftList,
        rightList = columnStore.rightList;
    return h('div', {
      class: ['vxe-table', 'vxe-table--render-default', "tid_".concat(tId), vSize ? "size--".concat(vSize) : '', "border--".concat(tableBorder), {
        'vxe-editable': !!editConfig,
        'cell--highlight': highlightCell,
        'cell--selected': mouseConfig && mouseOpts.selected,
        'cell--area': mouseConfig && mouseOpts.area,
        'row--highlight': rowOpts.isHover || highlightHoverRow,
        'column--highlight': columnOpts.isHover || highlightHoverColumn,
        'is--header': showHeader,
        'is--footer': showFooter,
        'is--group': isGroup,
        'is--tree-line': treeConfig && treeOpts.line,
        'is--fixed-left': leftList.length,
        'is--fixed-right': rightList.length,
        'is--animat': !!this.animat,
        'is--round': this.round,
        'is--stripe': !treeConfig && stripe,
        'is--loading': loading,
        'is--empty': !loading && !tableData.length,
        'is--scroll-y': overflowY,
        'is--scroll-x': overflowX,
        'is--virtual-x': scrollXLoad,
        'is--virtual-y': scrollYLoad
      }],
      on: {
        keydown: this.keydownEvent
      }
    }, [
    /**
     * 隐藏列
     */
    h('div', {
      class: 'vxe-table-slots',
      ref: 'hideColumn'
    }, this.$slots.default), h('div', {
      class: 'vxe-table--render-wrapper'
    }, [h('div', {
      class: 'vxe-table--main-wrapper'
    }, [
    /**
     * 表头
     */
    showHeader ? h('vxe-table-header', {
      ref: 'tableHeader',
      props: {
        tableData: tableData,
        tableColumn: tableColumn,
        tableGroupColumn: tableGroupColumn,
        size: vSize
      }
    }) : _e(),
    /**
     * 表体
     */
    h('vxe-table-body', {
      ref: 'tableBody',
      props: {
        tableData: tableData,
        tableColumn: tableColumn,
        size: vSize
      }
    }),
    /**
     * 表尾
     */
    showFooter ? h('vxe-table-footer', {
      ref: 'tableFooter',
      props: {
        footerTableData: footerTableData,
        tableColumn: tableColumn,
        size: vSize
      }
    }) : _e()]), h('div', {
      class: 'vxe-table--fixed-wrapper'
    }, [
    /**
     * 左侧固定区域
     */
    leftList && leftList.length && overflowX ? renderFixed(h, this, 'left') : _e(),
    /**
     * 右侧固定区域
     */
    rightList && rightList.length && overflowX ? renderFixed(h, this, 'right') : _e()])]),
    /**
     * 空数据
     */
    h('div', {
      ref: 'emptyPlaceholder',
      class: 'vxe-table--empty-placeholder'
    }, [h('div', {
      class: 'vxe-table--empty-content'
    }, renderEmptyContenet(h, this))]),
    /**
     * 边框线
     */
    h('div', {
      class: 'vxe-table--border-line'
    }),
    /**
     * 列宽线
     */
    h('div', {
      class: 'vxe-table--resizable-bar',
      style: overflowX ? {
        'padding-bottom': "".concat(scrollbarHeight, "px")
      } : null,
      ref: 'resizeBar'
    }),
    /**
     * 加载中
     */
    h('div', {}, [// zmj拓展
    h('a-spin', {
      class: 'a--loading',
      props: {
        spinning: loading
      }
    })]),
    /**
     * 筛选
     */
    initStore.filter ? h('vxe-table-filter', {
      ref: 'filterWrapper',
      props: {
        filterStore: filterStore
      }
    }) : _e(),
    /**
     * 导入
     */
    initStore.import && this.importConfig ? h('vxe-import-panel', {
      props: {
        defaultOptions: this.importParams,
        storeData: this.importStore
      }
    }) : _e(),
    /**
     * 导出/打印
     */
    initStore.export && (this.exportConfig || this.printConfig) ? h('vxe-export-panel', {
      props: {
        defaultOptions: this.exportParams,
        storeData: this.exportStore
      }
    }) : _e(),
    /**
     * 快捷菜单
     */
    ctxMenuStore.visible && this.isCtxMenu ? h('vxe-table-context-menu', {
      ref: 'ctxWrapper',
      props: {
        ctxMenuStore: ctxMenuStore,
        ctxMenuOpts: ctxMenuOpts
      }
    }) : _e(),
    /**
     * 通用提示
     */
    hasTip ? h('vxe-tooltip', {
      ref: 'commTip',
      props: {
        isArrow: false,
        enterable: false
      }
    }) : _e(),
    /**
     * 工具提示
     */
    hasTip ? h('vxe-tooltip', {
      ref: 'tooltip',
      props: this.tipConfig
    }) : _e(),
    /**
     * 校验提示
     */
    hasTip && this.editRules && validOpts.showMessage && (validOpts.message === 'default' ? !height : validOpts.message === 'tooltip') ? h('vxe-tooltip', {
      ref: 'validTip',
      class: 'vxe-table--valid-error',
      props: validOpts.message === 'tooltip' || tableData.length === 1 ? validTipOpts : null
    }) : _e()]);
  },
  methods: _methods.default
};
exports.default = _default2;