"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.UtilTools = void 0;
exports.eqEmptyValue = eqEmptyValue;
exports.getColumnList = getColumnList;
exports.getFuncText = getFuncText;
exports.isEnableConf = isEnableConf;

var _xeUtils = _interopRequireDefault(require("xe-utils"));

var _conf = _interopRequireDefault(require("../v-x-e-table/src/conf"));

var _log = require("../tools/log");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var zindexIndex = 0;
var lastZindex = 1;

function isEnableConf(conf) {
  return conf && conf.enabled !== false;
}
/**
 * 判断值为：'' | null | undefined 时都属于空值
 */


function eqEmptyValue(cellValue) {
  return cellValue === '' || _xeUtils.default.eqNull(cellValue);
}

function getFuncText(content) {
  return _xeUtils.default.isFunction(content) ? content() : _conf.default.translate ? _conf.default.translate(content) : content;
} // 获取所有的列，排除分组


function getColumnList(columns) {
  var result = [];
  columns.forEach(function (column) {
    result.push.apply(result, _toConsumableArray(column.children && column.children.length ? getColumnList(column.children) : [column]));
  });
  return result;
}

var UtilTools = {
  nextZIndex: function nextZIndex() {
    lastZindex = _conf.default.zIndex + zindexIndex++;
    return lastZindex;
  },
  getLastZIndex: function getLastZIndex() {
    return lastZindex;
  },
  getColumnList: getColumnList,
  getClass: function getClass(property, params) {
    return property ? _xeUtils.default.isFunction(property) ? property(params) : property : '';
  },
  formatText: function formatText(value, placeholder) {
    return '' + (value === '' || value === null || value === undefined ? placeholder ? _conf.default.emptyCell : '' : value);
  },
  getCellValue: function getCellValue(row, column) {
    return _xeUtils.default.get(row, column.property);
  },
  setCellValue: function setCellValue(row, column, value) {
    return _xeUtils.default.set(row, column.property, value);
  },
  // 组装列配置
  assemColumn: function assemColumn(_vm) {
    var $el = _vm.$el,
        $xetable = _vm.$xetable,
        $xecolumn = _vm.$xecolumn,
        columnConfig = _vm.columnConfig;
    var groupConfig = $xecolumn ? $xecolumn.columnConfig : null;
    columnConfig.slots = _vm.$scopedSlots;

    if (groupConfig) {
      if (process.env.NODE_ENV === 'development') {
        if ($xecolumn.$options._componentTag === 'vxe-table-column') {
          (0, _log.errLog)('vxe.error.groupTag', ["<vxe-table-colgroup title=".concat($xecolumn.title, " ...>"), "<vxe-table-column title=".concat($xecolumn.title, " ...>")]);
        } else if ($xecolumn.$options._componentTag === 'vxe-column') {
          (0, _log.warnLog)('vxe.error.groupTag', ["<vxe-colgroup title=".concat($xecolumn.title, " ...>"), "<vxe-column title=".concat($xecolumn.title, " ...>")]);
        }
      }

      if (!groupConfig.children) {
        groupConfig.children = [];
      }

      groupConfig.children.splice([].indexOf.call($xecolumn.$el.children, $el), 0, columnConfig);
    } else {
      $xetable.staticColumns.splice([].indexOf.call($xetable.$refs.hideColumn.children, $el), 0, columnConfig);
    }
  },
  // 销毁列
  destroyColumn: function destroyColumn(_vm) {
    var $xetable = _vm.$xetable,
        columnConfig = _vm.columnConfig;

    var matchObj = _xeUtils.default.findTree($xetable.staticColumns, function (column) {
      return column === columnConfig;
    });

    if (matchObj) {
      matchObj.items.splice(matchObj.index, 1);
    }
  },
  hasChildrenList: function hasChildrenList(item) {
    return item && item.children && item.children.length > 0;
  },
  parseFile: function parseFile(file) {
    var name = file.name;

    var tIndex = _xeUtils.default.lastIndexOf(name, '.');

    var type = name.substring(tIndex + 1, name.length);
    var filename = name.substring(0, tIndex);
    return {
      filename: filename,
      type: type
    };
  },
  isNumVal: function isNumVal(num) {
    return !isNaN(parseFloat('' + num));
  }
};
exports.UtilTools = UtilTools;
var _default = UtilTools;
exports.default = _default;