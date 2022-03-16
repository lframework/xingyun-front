"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Export = void 0;
exports.print = print;
Object.defineProperty(exports, "readFile", {
  enumerable: true,
  get: function get() {
    return _mixin.readLocalFile;
  }
});
Object.defineProperty(exports, "saveFile", {
  enumerable: true,
  get: function get() {
    return _mixin.saveLocalFile;
  }
});

var _table = _interopRequireDefault(require("../table"));

var _vXETable = _interopRequireDefault(require("../v-x-e-table"));

var _exportPanel = _interopRequireDefault(require("./src/export-panel"));

var _importPanel = _interopRequireDefault(require("./src/import-panel"));

var _mixin = _interopRequireWildcard(require("./src/mixin"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function print(options) {
  var opts = Object.assign({}, options, {
    type: 'html'
  });
  (0, _mixin.handlePrint)(null, opts, opts.content);
}

var Export = {
  ExportPanel: _exportPanel.default,
  ImportPanel: _importPanel.default,
  install: function install(Vue) {
    _vXETable.default.reg('export');

    _vXETable.default.saveFile = _mixin.saveLocalFile;
    _vXETable.default.readFile = _mixin.readLocalFile;
    _vXETable.default.print = print;

    _vXETable.default.setup({
      export: {
        types: {
          csv: 0,
          html: 0,
          xml: 0,
          txt: 0
        }
      }
    });

    _table.default.mixins.push(_mixin.default);

    Vue.component(_exportPanel.default.name, _exportPanel.default);
    Vue.component(_importPanel.default.name, _importPanel.default);
  }
};
exports.Export = Export;
var _default = Export;
exports.default = _default;