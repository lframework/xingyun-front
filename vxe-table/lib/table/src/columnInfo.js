"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColumnInfo = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../../v-x-e-table/src/conf"));

var _formats = require("../../v-x-e-table/src/formats");

var _util = require("./util");

var _utils = require("../../tools/utils");

var _log = require("../../tools/log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var ColumnInfo = /*#__PURE__*/function () {
  /* eslint-disable @typescript-eslint/no-use-before-define */
  function ColumnInfo($xetable, _vm) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        renderHeader = _ref.renderHeader,
        renderCell = _ref.renderCell,
        renderFooter = _ref.renderFooter,
        renderData = _ref.renderData;

    _classCallCheck(this, ColumnInfo);

    var $xegrid = $xetable.$xegrid;
    var proxyOpts = $xegrid ? $xegrid.proxyOpts : null;
    var formatter = _vm.formatter;
    var visible = _xeUtils.default.isBoolean(_vm.visible) ? _vm.visible : true;

    if (process.env.NODE_ENV === 'development') {
      var types = ['seq', 'checkbox', 'radio', 'expand', 'html'];

      if (_vm.type && types.indexOf(_vm.type) === -1) {
        (0, _log.warnLog)('vxe.error.errProp', ["type=".concat(_vm.type), types.join(', ')]);
      }

      if (_xeUtils.default.isBoolean(_vm.cellRender) || _vm.cellRender && !_xeUtils.default.isObject(_vm.cellRender)) {
        (0, _log.warnLog)('vxe.error.errProp', ["column.cell-render=".concat(_vm.cellRender), 'column.cell-render={}']);
      }

      if (_xeUtils.default.isBoolean(_vm.editRender) || _vm.editRender && !_xeUtils.default.isObject(_vm.editRender)) {
        (0, _log.warnLog)('vxe.error.errProp', ["column.edit-render=".concat(_vm.editRender), 'column.edit-render={}']);
      }

      if (_vm.cellRender && _vm.editRender) {
        (0, _log.warnLog)('vxe.error.errConflicts', ['column.cell-render', 'column.edit-render']);
      }

      if (_vm.type === 'expand') {
        if ($xetable.treeConfig && $xetable.treeOpts.line) {
          (0, _log.errLog)('vxe.error.errConflicts', ['tree-config.line', 'column.type=expand']);
        }
      }

      if (_vm.remoteSort) {
        (0, _log.warnLog)('vxe.error.delProp', ['column.remote-sort', 'sort-config.remote']);
      }

      if (_vm.sortMethod) {
        (0, _log.warnLog)('vxe.error.delProp', ['column.sort-method', 'sort-config.sortMethod']);
      }

      if (formatter) {
        if (_xeUtils.default.isString(formatter)) {
          var globalFunc = _formats.formats.get(formatter) || _xeUtils.default[formatter];

          if (!_xeUtils.default.isFunction(globalFunc)) {
            (0, _log.errLog)('vxe.error.notFunc', [formatter]);
          }
        } else if (_xeUtils.default.isArray(formatter)) {
          var _globalFunc = _formats.formats.get(formatter[0]) || _xeUtils.default[formatter[0]];

          if (!_xeUtils.default.isFunction(_globalFunc)) {
            (0, _log.errLog)('vxe.error.notFunc', [formatter[0]]);
          }
        }
      }
    }

    Object.assign(this, {
      // 基本属性
      type: _vm.type,
      property: _vm.field,
      field: _vm.field,
      title: _vm.title,
      width: _vm.width,
      minWidth: _vm.minWidth,
      resizable: _vm.resizable,
      fixed: _vm.fixed,
      align: _vm.align,
      headerAlign: _vm.headerAlign,
      footerAlign: _vm.footerAlign,
      showOverflow: _vm.showOverflow,
      showHeaderOverflow: _vm.showHeaderOverflow,
      showFooterOverflow: _vm.showFooterOverflow,
      className: _vm.className,
      headerClassName: _vm.headerClassName,
      footerClassName: _vm.footerClassName,
      formatter: formatter,
      sortable: _vm.sortable,
      sortBy: _vm.sortBy,
      sortType: _vm.sortType,
      sortMethod: _vm.sortMethod,
      remoteSort: _vm.remoteSort,
      filters: (0, _util.toFilters)(_vm.filters),
      filterMultiple: _xeUtils.default.isBoolean(_vm.filterMultiple) ? _vm.filterMultiple : true,
      filterMethod: _vm.filterMethod,
      filterResetMethod: _vm.filterResetMethod,
      filterRecoverMethod: _vm.filterRecoverMethod,
      filterRender: _vm.filterRender,
      treeNode: _vm.treeNode,
      cellType: _vm.cellType,
      cellRender: _vm.cellRender,
      editRender: _vm.editRender,
      contentRender: _vm.contentRender,
      exportMethod: _vm.exportMethod,
      footerExportMethod: _vm.footerExportMethod,
      titleHelp: _vm.titleHelp,
      titlePrefix: _vm.titlePrefix,
      // 自定义参数
      params: _vm.params,
      // 渲染属性
      id: _vm.colId || _xeUtils.default.uniqueId('col_'),
      parentId: null,
      visible: visible,
      // 内部属性（一旦被使用，将导致不可升级版本）
      halfVisible: false,
      defaultVisible: visible,
      checked: false,
      halfChecked: false,
      disabled: false,
      level: 1,
      rowSpan: 1,
      colSpan: 1,
      order: null,
      sortTime: 0,
      renderWidth: 0,
      renderHeight: 0,
      resizeWidth: 0,
      renderLeft: 0,
      renderArgs: [],
      // 渲染参数可用于扩展
      model: {},
      renderHeader: renderHeader || _vm.renderHeader,
      renderCell: renderCell || _vm.renderCell,
      renderFooter: renderFooter || _vm.renderFooter,
      renderData: renderData,
      // 单元格插槽，只对 grid 有效
      slots: _vm.slots
    });

    if (proxyOpts && proxyOpts.beforeColumn) {
      proxyOpts.beforeColumn({
        $grid: $xegrid,
        column: this
      });
    }
  }

  _createClass(ColumnInfo, [{
    key: "getTitle",
    value: function getTitle() {
      return (0, _utils.getFuncText)(this.title || (this.type === 'seq' ? _conf.default.i18n('vxe.table.seqTitle') : ''));
    }
  }, {
    key: "getKey",
    value: function getKey() {
      return this.property || (this.type ? "type=".concat(this.type) : null);
    }
  }, {
    key: "update",
    value: function update(name, value) {
      // 不支持双向的属性
      if (name !== 'filters') {
        if (name === 'field') {
          // 兼容旧属性
          this.property = value;
        }

        this[name] = value;
      }
    }
  }]);

  return ColumnInfo;
}();

exports.ColumnInfo = ColumnInfo;