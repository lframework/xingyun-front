"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Tooltip = void 0;

var _tooltip = _interopRequireDefault(require("./src/tooltip"));

var _vXETable = _interopRequireDefault(require("../v-x-e-table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tooltip = Object.assign(_tooltip.default, {
  install: function install(Vue) {
    _vXETable.default._tooltip = 1;
    Vue.component(_tooltip.default.name, _tooltip.default);
  }
});
exports.Tooltip = Tooltip;
var _default = Tooltip;
exports.default = _default;